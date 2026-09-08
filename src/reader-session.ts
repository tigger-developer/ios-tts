// ABOUTME: Owns one transient reader and rejects stale asynchronous completion.
// ABOUTME: Host callbacks render and present content without exposing host APIs here.
import { exceedsWordLimit } from "./reader-settings.ts";
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
  private readonly host: ReaderHost;
  private current: { view?: ReaderView } | null = null;
  constructor(host: ReaderHost) {
    this.host = host;
  }

  async open(
    snapshot: { source: string; path: string } | null,
    maximum: number,
  ): Promise<void> {
    this.close();
    if (!snapshot) {
      this.host.notice("unsupported");
      return;
    }
    if (exceedsWordLimit(snapshot.source, maximum)) {
      this.host.notice("limit", maximum);
      return;
    }
    const session: { view?: ReaderView } = {};
    this.current = session;
    try {
      session.view = this.host.create(() => {
        if (this.current === session) this.close();
      });
      await session.view.render(snapshot.source, snapshot.path);
      if (this.current === session) session.view.publish();
    } catch {
      if (this.current === session) {
        this.close();
        this.host.notice("render");
      }
    } finally {
      // Release DOM that an already-closed renderer added before settling.
      if (this.current !== session) session.view?.dispose();
    }
  }
  close(): void {
    const previous = this.current;
    this.current = null;
    previous?.view?.dispose();
  }
}
