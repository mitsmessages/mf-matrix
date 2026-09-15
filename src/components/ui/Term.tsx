import type { ReactNode } from "react";
import { GLOSSARY, type GlossaryKey } from "@/domain/finance/glossary";

/** A label with a plain-English definition on hover (and keyboard focus). */
export function Term({
  term,
  children,
  className,
}: {
  term: GlossaryKey;
  children?: ReactNode;
  className?: string;
}) {
  const entry = GLOSSARY[term];
  return (
    <abbr
      title={`${entry.name}: ${entry.plain}`}
      className={`cursor-help decoration-dotted decoration-stone-400 underline-offset-2 no-underline hover:underline ${className ?? ""}`}
    >
      {children ?? entry.name}
    </abbr>
  );
}
