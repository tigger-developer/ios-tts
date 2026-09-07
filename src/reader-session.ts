// ABOUTME: Owns one transient reader and rejects stale asynchronous completion.
// ABOUTME: Host callbacks render and present content without exposing host APIs here.
export interface ReaderView {
  render(source: string, path: string): Promise<void>;
  publish(): void;
  dispose(): void;
}
export interface ReaderHost {
  create(onClose: () => void): ReaderView;
  notice(reason: "unsupported" | "render" | "limit", maximum?: number): void;
}
export class ReaderSession {
  constructor(_host: ReaderHost) {}
  open(
    _snapshot: { source: string; path: string } | null,
    _maximum: number,
  ): Promise<void> {
    return Promise.resolve();
  }
  close(): void {}
}
