import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useMemo } from 'react';

interface TexProps {
  /** LaTeX from lesson content. Never pass learner input here. */
  math: string;
  display?: boolean;
}

/** Renders notation with KaTeX, including MathML for screen readers. */
export function Tex({ math, display = false }: TexProps) {
  const html = useMemo(
    () =>
      katex.renderToString(math, {
        displayMode: display,
        output: 'htmlAndMathml',
        throwOnError: true,
      }),
    [math, display],
  );
  return <span className="tex" dangerouslySetInnerHTML={{ __html: html }} />;
}
