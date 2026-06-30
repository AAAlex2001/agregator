type Handler = (message: string) => void;

let handler: Handler | null = null;

export function onError(next: Handler): () => void {
  handler = next;
  return () => {
    if (handler === next) handler = null;
  };
}

export function emitError(message: string): void {
  handler?.(message);
}
