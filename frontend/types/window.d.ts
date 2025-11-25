declare global {
  interface Window {
    VANTA?: {
      CLOUDS?: (options: Record<string, unknown>) => { destroy?: () => void };
      [key: string]: any;
    };
  }
}

export {};

