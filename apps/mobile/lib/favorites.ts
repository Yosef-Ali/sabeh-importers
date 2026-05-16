import { useEffect, useSyncExternalStore } from "react";
import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "sabeh.favorites.v1";

let favorites: ReadonlySet<string> = new Set();
let hasLoaded = false;
let loadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function load(): Promise<void> {
  if (hasLoaded) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          favorites = new Set(parsed.filter((x): x is string => typeof x === "string"));
        }
      }
    } catch {
      // First launch / corrupted store — start empty.
    } finally {
      hasLoaded = true;
      notify();
    }
  })();

  return loadPromise;
}

async function persist(snapshot: ReadonlySet<string>) {
  try {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(Array.from(snapshot)));
  } catch {
    // Best-effort — UI already updated optimistically.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return favorites;
}

/**
 * Reactive favorite state for a single listing. Persists to SecureStore so
 * saves survive app restarts. All components calling this hook stay in sync
 * via a module-level subscribable store.
 */
export function useFavorite(id: string | undefined): {
  saved: boolean;
  loaded: boolean;
  toggle: () => void;
} {
  useEffect(() => {
    void load();
  }, []);

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const saved = !!id && snapshot.has(id);

  function toggle() {
    if (!id) return;
    const next = new Set(snapshot);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    favorites = next;
    void persist(next);
    notify();
  }

  return { saved, loaded: hasLoaded, toggle };
}

/** Read-only list of all favorited IDs — useful for a /favorites screen later. */
export function useFavoriteIds(): string[] {
  useEffect(() => {
    void load();
  }, []);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return Array.from(snapshot);
}
