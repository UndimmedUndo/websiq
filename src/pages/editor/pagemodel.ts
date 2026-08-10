export type ElementTyp = "box" | "text" | "bild" | "knapp" | "scroll" | "grid" | "input";

export interface ManuellElement {
  id: string;
  typ: ElementTyp;
  namn: string;
  x: number;
  y: number;
  bredd: number;
  hojd: number;
  text?: string;
  bakgrund?: string;
  rotation?: number;
  radie?: number;
  opacitet?: number;
  zIndex?: number;
  textFarg?: string;
  fontStorlek?: number;
  fontVikt?: string;
  textAlign?: "left" | "center" | "right";
  kantfarg?: string;
  kantbredd?: number;
  kantstil?: "solid" | "dashed" | "dotted";
  skugga?: boolean;
  skuggaFarg?: string;
  skuggaX?: number;
  skuggaY?: number;
  skuggaBlur?: number;
  skuggaSpridning?: number;
  skuggaOpacitet?: number;
  bildUrl?: string;
  bildFit?: "cover" | "contain";
  lank?: string;
  bokstavsMellanrum?: number;
  radavstand?: number;
  blandningslage?: string;
  cursor?: string;
  overflowDold?: boolean;
  laast?: boolean;
  glasEffekt?: boolean;
  glasStyrka?: number;
  gradient?: boolean;
  gradientFarg2?: string;
  gradientVinkel?: number;
  textskugga?: boolean;
  understruken?: boolean;
  hoverSkala?: number;
  hoverBakgrund?: string;
  gridKolumner?: number;
  gridRader?: number;
  gridMellanrum?: number;
  gridCellFarg?: string;
  gridCellHojd?: number;
  platshallareText?: string;
  skaladText?: boolean;
}

export type PageFormat = "elements" | "html";

export interface Sida {
  id: string;
  namn: string;
  laast?: boolean;
  format: PageFormat;
  element: ManuellElement[];
  html?: string;
  baseUrl?: string;
}

export enum Plan {
  None = "none",
  Start = "start",
  Pro = "pro",
  Premium = "premium",
}

export const PLAN_MAX_SIDOR: Record<Plan, number> = {
  [Plan.None]: 5,
  [Plan.Start]: 5,
  [Plan.Pro]: 15,
  [Plan.Premium]: 25,
};

export function mappaPlan(sub: string | null | undefined): Plan {
  if (sub === "Start") return Plan.Start;
  if (sub === "Business") return Plan.Pro;
  if (sub === "Premium" || sub === "Enterprise") return Plan.Premium;
  return Plan.None;
}

export function skapaTomSida(namn: string, laast = false): Sida {
  return { id: "", namn, element: [], laast, format: "elements" };
}