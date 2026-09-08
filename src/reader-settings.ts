// ABOUTME: Owns the word-limit preference and source-token admission rule.
// ABOUTME: Persistence is supplied by the host and never contains note content.
export const DEFAULT_MAX_WORDS = 100000;
export interface PreferenceStore {
  load(): Promise<unknown>;
  save(value: { maxWords: number }): Promise<void>;
}
export class ReaderSettings {
  private activeLimit = DEFAULT_MAX_WORDS;
  private pending = false;
  private readonly store: PreferenceStore;
  constructor(store: PreferenceStore) {
    this.store = store;
  }
  get maxWords(): number {
    return this.activeLimit;
  }
  get saving(): boolean {
    return this.pending;
  }

  async load(): Promise<"load" | null> {
    this.activeLimit = DEFAULT_MAX_WORDS;
    try {
      const raw = await this.store.load();
      if (raw == null) return null;
      if (typeof raw !== "object" || Array.isArray(raw)) return "load";
      if (!("maxWords" in raw)) return null;
      if (!validLimit(raw.maxWords)) return "load";
      this.activeLimit = raw.maxWords;
      return null;
    } catch {
      return "load";
    }
  }
  async save(input: string): Promise<"invalid" | "busy" | "save" | null> {
    if (this.pending) return "busy";
    const trimmed = input.trim();
    const value = Number(trimmed);
    if (!/^[0-9]+$/.test(trimmed) || !validLimit(value)) return "invalid";
    this.pending = true;
    try {
      await this.store.save({ maxWords: value });
      this.activeLimit = value;
      return null;
    } catch {
      return "save";
    } finally {
      this.pending = false;
    }
  }
}
function validLimit(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}
export function exceedsWordLimit(source: string, maximum: number): boolean {
  const tokens = /\S+/gu;
  let count = 0;
  while (tokens.test(source)) {
    if (++count > maximum) return true;
  }
  return false;
}
