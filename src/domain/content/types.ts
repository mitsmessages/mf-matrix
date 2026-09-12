/** Content model for the curriculum. Every claim carries a citation. */

export type LabId = "allocation" | "tvm" | "screener" | "diligence" | "none";

export type ModuleCategory =
  | "Strategic Foundation"
  | "Goal Planning"
  | "Asset Classes"
  | "Macro Economics"
  | "Quantitative Filters"
  | "Portfolio Due Diligence"
  | "Synthesis";

export interface Citation {
  /** Source lecture id, e.g. "L03-1". */
  lectureId: string;
  /** Human-readable label. */
  label: string;
  /** Optional SRT timestamp (mm:ss) for deep-linking. */
  timestamp?: string;
}

export interface Formula {
  name: string;
  formula: string;
  description: string;
}

export interface CourseModule {
  id: string;
  order: number;
  code: string;
  title: string;
  subtitle: string;
  category: ModuleCategory;
  keyInsights: string[];
  commonMistake: string;
  scientificSolution: string;
  practicalRule: string;
  formulas: Formula[];
  lab: LabId;
  citations: Citation[];
}
