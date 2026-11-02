import type { Provenance } from '../provenance';

export const ui = {
  appName: 'Linear Algebra, Made Visible',
  tagline: 'See it move, understand what changed, then prove or calculate it.',
  status: 'Early prototype: the first three labs are being built.',
  coreIdea: {
    heading: 'The idea everything is built from',
    body: 'A linear combination: scale some vectors, then add them up. Span, matrices, bases and eigenvectors are all built from this one move.',
    math: String.raw`c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_k\mathbf{v}_k`,
  },
  labs: {
    heading: 'Labs in progress',
    items: [
      {
        id: 'vector-playground',
        title: 'Vector playground',
        summary: 'Drag or type two vectors, then add and scale them.',
      },
      {
        id: 'row-reduction',
        title: 'Row-reduction theatre',
        summary: 'Apply one row operation at a time and watch the equations change.',
      },
      {
        id: 'matrix-transform',
        title: 'Matrix transformation lab',
        summary: 'Edit a 2 × 2 matrix and watch the whole grid move.',
      },
    ],
  },
  provenance: {
    'textbook-original': 'Textbook original',
    'uploaded-past-paper': 'Uploaded past paper',
    'instructor-provided': 'Instructor-provided',
    'app-generated': 'App-generated practice',
    illustration: 'Illustration',
  } satisfies Record<Provenance, string>,
} as const;
