import { ui } from '../content/en/ui';
import type { Provenance } from '../content/provenance';

interface SourceLabelProps {
  kind: Provenance;
  /** Edition, page or paper details. Required in practice for every kind except the app's own. */
  citation?: string;
}

/** Says where a question or example comes from. Every one must carry a label (spec §4, §9). */
export function SourceLabel({ kind, citation }: SourceLabelProps) {
  return (
    <span className="source-label" data-kind={kind}>
      {ui.provenance[kind]}
      {citation !== undefined && <span className="source-label__citation"> · {citation}</span>}
    </span>
  );
}
