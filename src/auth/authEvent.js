const listeners = new Set();

export function emitAuthExpired() {
  listeners.forEach((cb) => cb());
}

export function subscribeAuthExpired(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
