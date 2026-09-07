// ABOUTME: Owns the word-limit preference and source-token admission rule.
// ABOUTME: Persistence is supplied by the host and never contains note content.
export const DEFAULT_MAX_WORDS = 100000;
export interface PreferenceStore {
  load(): Promise<unknown>;
  save(value: { maxWords: number }): Promise<void>;
}
export class ReaderSettings {
  maxWords = DEFAULT_MAX_WORDS;
  saving = false;
  constructor(_store: PreferenceStore) {}
  load(): Promise<"load" | null> {
    return Promise.resolve(null);
  }
  save(_input: string): Promise<"invalid" | "busy" | "save" | null> {
    return Promise.resolve(null);
  }
}
export function exceedsWordLimit(_source: string, _maximum: number): boolean {
  return false;
}
