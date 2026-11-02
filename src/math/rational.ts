import { MathError } from './errors';

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    [x, y] = [y, x % y];
  }
  return x;
}

function toBigInt(value: bigint | number): bigint {
  if (typeof value === 'bigint') return value;
  if (!Number.isSafeInteger(value)) {
    throw new MathError('INVALID_NUMBER', `${value} is not a safe integer`);
  }
  return BigInt(value);
}

// Integers ("-3"), finite decimals ("0.25", "-1.5", ".5") and fractions ("3/4", "-3/4").
const DECIMAL = /^([+-]?)(\d*)(?:\.(\d*))?$/;
const FRACTION = /^([+-]?\d+)\s*\/\s*([+-]?\d+)$/;

/**
 * An exact fraction num/den, always stored in lowest terms with den > 0.
 * Instances are immutable; every operation returns a new Rational.
 */
export class Rational {
  readonly num: bigint;
  readonly den: bigint;

  private constructor(num: bigint, den: bigint) {
    this.num = num;
    this.den = den;
  }

  static readonly ZERO = new Rational(0n, 1n);
  static readonly ONE = new Rational(1n, 1n);

  /** Builds num/den in lowest terms. Numbers must be safe integers. */
  static of(num: bigint | number, den: bigint | number = 1n): Rational {
    const n = toBigInt(num);
    const d = toBigInt(den);
    if (d === 0n) throw new MathError('ZERO_DENOMINATOR');
    const sign = d < 0n ? -1n : 1n;
    const g = gcd(n, d);
    return new Rational((sign * n) / g, (sign * d) / g);
  }

  /** Parses what a learner might type: "2", "-1.5", "3/4". Decimals are converted exactly. */
  static parse(text: string): Rational {
    const s = text.trim();
    const fraction = FRACTION.exec(s);
    if (fraction) {
      return Rational.of(BigInt(fraction[1] ?? ''), BigInt(fraction[2] ?? ''));
    }
    const decimal = DECIMAL.exec(s);
    const whole = decimal?.[2] ?? '';
    const frac = decimal?.[3] ?? '';
    if (!decimal || whole + frac === '') {
      throw new MathError('INVALID_NUMBER', JSON.stringify(text));
    }
    const sign = decimal[1] === '-' ? -1n : 1n;
    return Rational.of(sign * BigInt(whole + frac), 10n ** BigInt(frac.length));
  }

  add(other: Rational): Rational {
    return Rational.of(this.num * other.den + other.num * this.den, this.den * other.den);
  }

  sub(other: Rational): Rational {
    return this.add(other.neg());
  }

  mul(other: Rational): Rational {
    return Rational.of(this.num * other.num, this.den * other.den);
  }

  div(other: Rational): Rational {
    if (other.isZero()) throw new MathError('DIVISION_BY_ZERO');
    return Rational.of(this.num * other.den, this.den * other.num);
  }

  neg(): Rational {
    return new Rational(-this.num, this.den);
  }

  abs(): Rational {
    return this.num < 0n ? this.neg() : this;
  }

  isZero(): boolean {
    return this.num === 0n;
  }

  isInteger(): boolean {
    return this.den === 1n;
  }

  /** -1, 0 or 1. */
  sign(): number {
    return this.num < 0n ? -1 : this.num > 0n ? 1 : 0;
  }

  equals(other: Rational): boolean {
    return this.num === other.num && this.den === other.den;
  }

  /** Negative if this < other, zero if equal, positive if this > other. */
  compare(other: Rational): number {
    return this.sub(other).sign();
  }

  /** Approximate value, for screen positions only. Never use it for maths. */
  toNumber(): number {
    return Number(this.num) / Number(this.den);
  }

  /** Machine-readable form that `parse` accepts, e.g. "-3/4". */
  toString(): string {
    return this.isInteger() ? `${this.num}` : `${this.num}/${this.den}`;
  }

  /** Display form with a true minus sign, e.g. "−3/4". */
  format(): string {
    return this.toString().replace('-', '−');
  }
}
