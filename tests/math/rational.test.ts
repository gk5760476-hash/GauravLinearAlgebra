import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { MathError } from '../../src/math/errors';
import { Rational } from '../../src/math/rational';

const bigints = fc.bigInt({ min: -(10n ** 12n), max: 10n ** 12n });
const nonZeroBigints = bigints.filter((n) => n !== 0n);
const rationals = fc.tuple(bigints, nonZeroBigints).map(([n, d]) => Rational.of(n, d));
const nonZeroRationals = rationals.filter((r) => !r.isZero());

function expectMathError(fn: () => unknown, code: MathError['code']) {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(MathError);
    expect((error as MathError).code).toBe(code);
    return;
  }
  throw new Error(`expected MathError ${code}`);
}

describe('Rational construction', () => {
  it('reduces to lowest terms with a positive denominator', () => {
    expect(Rational.of(2, 4).toString()).toBe('1/2');
    expect(Rational.of(1, -2).toString()).toBe('-1/2');
    expect(Rational.of(-6, -9).toString()).toBe('2/3');
    expect(Rational.of(0, -5).toString()).toBe('0');
  });

  it('rejects a zero denominator', () => {
    expectMathError(() => Rational.of(1, 0), 'ZERO_DENOMINATOR');
  });

  it('rejects numbers that are not safe integers', () => {
    expectMathError(() => Rational.of(0.5), 'INVALID_NUMBER');
    expectMathError(() => Rational.of(2 ** 60), 'INVALID_NUMBER');
  });

  it('keeps every value in normal form', () => {
    fc.assert(
      fc.property(rationals, (r) => {
        expect(r.den > 0n).toBe(true);
        const reduced = Rational.of(r.num, r.den);
        expect(reduced.num).toBe(r.num);
        expect(reduced.den).toBe(r.den);
      }),
    );
  });
});

describe('Rational.parse', () => {
  it.each([
    ['2', '2'],
    ['-3', '-3'],
    ['+7', '7'],
    ['3/4', '3/4'],
    ['-3/4', '-3/4'],
    ['3/-4', '-3/4'],
    [' 6 / 8 ', '3/4'],
    ['-1.5', '-3/2'],
    ['0.25', '1/4'],
    ['.5', '1/2'],
    ['2.', '2'],
    ['0.1', '1/10'],
  ])('parses %j as %s', (input, expected) => {
    expect(Rational.parse(input).toString()).toBe(expected);
  });

  it.each(['', ' ', '.', '-', 'abc', '1.2.3', '1/2/3', '1e3', '1/2.5', '--1'])(
    'rejects %j',
    (input) => {
      expectMathError(() => Rational.parse(input), 'INVALID_NUMBER');
    },
  );

  it('rejects a zero denominator', () => {
    expectMathError(() => Rational.parse('1/0'), 'ZERO_DENOMINATOR');
  });

  it('round-trips through toString', () => {
    fc.assert(
      fc.property(rationals, (r) => {
        expect(Rational.parse(r.toString()).equals(r)).toBe(true);
      }),
    );
  });
});

describe('Rational arithmetic', () => {
  it('computes known results exactly', () => {
    const third = Rational.of(1, 3);
    const sixth = Rational.of(1, 6);
    expect(third.add(sixth).toString()).toBe('1/2');
    expect(third.sub(sixth).toString()).toBe('1/6');
    expect(third.mul(sixth).toString()).toBe('1/18');
    expect(third.div(sixth).toString()).toBe('2');
    expect(Rational.parse('0.1').add(Rational.parse('0.2')).toString()).toBe('3/10');
  });

  it('rejects division by zero', () => {
    expectMathError(() => Rational.ONE.div(Rational.ZERO), 'DIVISION_BY_ZERO');
  });

  it('undoes addition with subtraction: (a + b) − b = a', () => {
    fc.assert(
      fc.property(rationals, rationals, (a, b) => {
        expect(a.add(b).sub(b).equals(a)).toBe(true);
      }),
    );
  });

  it('undoes multiplication with division: (a × b) ÷ b = a for b ≠ 0', () => {
    fc.assert(
      fc.property(rationals, nonZeroRationals, (a, b) => {
        expect(a.mul(b).div(b).equals(a)).toBe(true);
      }),
    );
  });

  it('is commutative and associative', () => {
    fc.assert(
      fc.property(rationals, rationals, rationals, (a, b, c) => {
        expect(a.add(b).equals(b.add(a))).toBe(true);
        expect(a.mul(b).equals(b.mul(a))).toBe(true);
        expect(
          a
            .add(b)
            .add(c)
            .equals(a.add(b.add(c))),
        ).toBe(true);
        expect(
          a
            .mul(b)
            .mul(c)
            .equals(a.mul(b.mul(c))),
        ).toBe(true);
      }),
    );
  });

  it('distributes multiplication over addition', () => {
    fc.assert(
      fc.property(rationals, rationals, rationals, (a, b, c) => {
        expect(a.mul(b.add(c)).equals(a.mul(b).add(a.mul(c)))).toBe(true);
      }),
    );
  });
});

describe('Rational comparison and display', () => {
  it('orders values consistently with subtraction', () => {
    fc.assert(
      fc.property(rationals, rationals, (a, b) => {
        expect(a.compare(b)).toBe(a.sub(b).sign());
      }),
    );
    expect(Rational.of(1, 3).compare(Rational.of(1, 2))).toBeLessThan(0);
    expect(Rational.of(2, 4).compare(Rational.of(1, 2))).toBe(0);
  });

  it('reports sign, zero and integer status', () => {
    expect(Rational.of(-2, 3).sign()).toBe(-1);
    expect(Rational.ZERO.sign()).toBe(0);
    expect(Rational.ZERO.isZero()).toBe(true);
    expect(Rational.of(4, 2).isInteger()).toBe(true);
    expect(Rational.of(-2, 3).abs().toString()).toBe('2/3');
  });

  it('formats with a true minus sign for display', () => {
    expect(Rational.of(-3, 4).format()).toBe('−3/4');
    expect(Rational.of(2).format()).toBe('2');
    expect(Rational.ZERO.format()).toBe('0');
  });

  it('approximates the value for screen positions', () => {
    expect(Rational.of(1, 4).toNumber()).toBe(0.25);
    expect(Rational.of(-1, 3).toNumber()).toBeCloseTo(-0.3333, 4);
  });
});
