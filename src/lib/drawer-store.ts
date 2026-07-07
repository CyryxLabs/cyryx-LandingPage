import { useSyncExternalStore } from "react";

export type DrawerTarget = { entity_type: string; entity_id: string; label?: string } | null;

let current: DrawerTarget = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export const drawerStore = {
  open(target: NonNullable<DrawerTarget>) {
    current = target;
    emit();
  },
  close() {
    current = null;
    emit();
  },
  get() {
    return current;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useDrawerTarget(): DrawerTarget {
  return useSyncExternalStore(
    drawerStore.subscribe,
    drawerStore.get,
    () => null,
  );
}