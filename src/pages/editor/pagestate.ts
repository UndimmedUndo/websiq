import type { Sida } from "./pagemodel";
import { debug } from "./debug";

export function skapaId(): string {
  return "s" + Math.random().toString(36).slice(2, 9);
}

export function normaliseraSidnamn(namn: string): string {
  return namn.trim().toLowerCase().replace(/\.astro$/, "");
}

export interface EditorState {
  sidor: Sida[];
  aktivSidaId: string;
  valtElementId: string | null;
  harOsparadeAndringar: boolean;
  aktivtForetagId: string | null;
  aktivtForetagNamn: string;
}

export function skapaInitialState(): EditorState {
  const startSida: Sida = {
    id: skapaId(),
    namn: "index.astro",
    element: [],
    laast: true,
    format: "elements",
  };
  return {
    sidor: [startSida],
    aktivSidaId: startSida.id,
    valtElementId: null,
    harOsparadeAndringar: false,
    aktivtForetagId: null,
    aktivtForetagNamn: "",
  };
}

export function hittaAktivSida(state: EditorState): Sida {
  return state.sidor.find((s) => s.id === state.aktivSidaId) || state.sidor[0];
}

export function hittaSidaViaNamn(state: EditorState, namn: string): Sida | undefined {
  const mal = normaliseraSidnamn(namn);
  return state.sidor.find((s) => normaliseraSidnamn(s.namn) === mal);
}

export function bytAktivSida(state: EditorState, id: string): void {
  state.aktivSidaId = id;
  state.valtElementId = null;
  debug("ui", "bytte aktiv sida", id);
}

export function markeraOsparat(state: EditorState): void {
  state.harOsparadeAndringar = true;
}

export function maxTillatnaSidor(planMax: number): number {
  return planMax;
}