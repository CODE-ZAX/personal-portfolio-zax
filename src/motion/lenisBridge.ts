type LenisLike = {
  on: (event: "scroll", callback: () => void) => () => void;
  stop: () => void;
  start: () => void;
  scrollTo: (target: number | string | HTMLElement, options?: { immediate?: boolean }) => void;
};

let current: LenisLike | null = null;
const listeners = new Set<() => void>();

export function setLenis(instance: LenisLike | null) {
  current = instance;
}

export function getLenis() {
  return current;
}

export function subscribeLenis(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function notifyLenisScroll() {
  listeners.forEach((callback) => callback());
}
