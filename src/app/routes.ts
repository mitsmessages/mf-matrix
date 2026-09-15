export interface StageRoute {
  to: string;
  label: string;
  shortLabel: string;
  stage: number;
}

export const STAGE_ROUTES: StageRoute[] = [
  { to: "/journey", label: "Journey", shortLabel: "Journey", stage: 0 },
  { to: "/allocation", label: "Stage 1 · Allocation", shortLabel: "1 Allocate", stage: 1 },
  { to: "/goal", label: "Stage 2 · Goal", shortLabel: "2 Goal", stage: 2 },
  { to: "/screener", label: "Stage 3 · Screen", shortLabel: "3 Screen", stage: 3 },
  { to: "/diligence", label: "Stage 4 · Diligence", shortLabel: "4 Diligence", stage: 4 },
  { to: "/scenario", label: "Stage 5 · Synthesis", shortLabel: "5 Synthesis", stage: 5 },
  { to: "/portfolio", label: "My Portfolio", shortLabel: "Portfolio", stage: 6 },
  { to: "/data", label: "Data", shortLabel: "Data", stage: 7 },
];
