import type { MathErrorCode } from '../../math/errors';

/** Plain-language explanations shown to learners for each engine error (FR-04). */
export const mathErrorMessages: Record<MathErrorCode, string> = {
  ZERO_DENOMINATOR: "A fraction can't have 0 on the bottom. Try a different number there.",
  DIVISION_BY_ZERO:
    "You can't divide by 0. Dividing asks “what times 0 gives this?”, and anything times 0 is 0.",
  INVALID_NUMBER:
    'Type a whole number (like 3 or −2), a decimal (like 1.5) or a fraction (like 3/4).',
};
