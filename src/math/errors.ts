/**
 * Error codes raised by the maths engine. The engine never contains
 * user-facing text: plain-language explanations live in
 * `src/content/en/errors.ts`, keyed by these codes.
 */
export type MathErrorCode = 'ZERO_DENOMINATOR' | 'DIVISION_BY_ZERO' | 'INVALID_NUMBER';

export class MathError extends Error {
  readonly code: MathErrorCode;

  constructor(code: MathErrorCode, detail?: string) {
    super(detail === undefined ? code : `${code}: ${detail}`);
    this.name = 'MathError';
    this.code = code;
  }
}
