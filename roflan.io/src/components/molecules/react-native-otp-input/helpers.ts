export const codeToArray = (code?: string): string[] => code?.split('') ?? [];

export const queueMacrotask = (cb: () => void): ReturnType<typeof setTimeout> =>
  setTimeout(() => {
    cb();
  }, 0);
