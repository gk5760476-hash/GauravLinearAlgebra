/** Where a question or example comes from (spec §9). See docs/decisions.md #4. */
export const PROVENANCE_KINDS = [
  'textbook-original',
  'uploaded-past-paper',
  'instructor-provided',
  'app-generated',
  'illustration',
] as const;

export type Provenance = (typeof PROVENANCE_KINDS)[number];
