// Tiny persisted store. In the browser it backs onto localStorage; in Node
// (tests) it falls back to an in-memory shim, so the module has no hard
// dependency on a DOM environment.

export function createStore(key, initial = {}, storage) {
  const memory = new Map();
  const backend =
    storage ??
    (typeof localStorage !== "undefined"
      ? localStorage
      : {
          getItem: (k) => (memory.has(k) ? memory.get(k) : null),
          setItem: (k, v) => memory.set(k, String(v)),
          removeItem: (k) => memory.delete(k),
        });

  const listeners = new Set();
  let snapshot = load();

  function load() {
    try {
      const raw = backend.getItem(key);
      if (raw != null) return { ...initial, ...JSON.parse(raw) };
    } catch {
      // Corrupt payload: fall back to defaults instead of crashing.
    }
    return { ...initial };
  }

  function persist() {
    backend.setItem(key, JSON.stringify(snapshot));
  }

  return {
    get() {
      return { ...snapshot };
    },
    set(updates) {
      snapshot = { ...snapshot, ...updates };
      persist();
      const copy = { ...snapshot };
      listeners.forEach((fn) => fn(copy));
    },
    onChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
