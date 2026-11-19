"use client";

import { useEffect, useRef } from "react";

/**
 * Debounced auto-save, so a field edit is never lost just because the admin
 * nav was clicked before hitting "Save draft". A plain client-side route
 * change (every admin nav link) never fires `beforeunload`, so
 * useUnsavedWarning alone can't catch it — this saves a short, quiet moment
 * after the last edit, and flushes one more time on unmount if a save was
 * still pending (covers navigating away inside that quiet moment).
 *
 * `key` must change on every edit (pass `JSON.stringify(draft)`, or include
 * other dirty-tracked fields like a catalog item's slug) so the debounce
 * timer resets correctly; `dirty`/`canSave` gate whether it's allowed to
 * fire at all (never while invalid, never when there's nothing new to save).
 */
export function useAutoSave(key: string, dirty: boolean, canSave: boolean, save: () => void, delayMs = 1500) {
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });
  const pendingRef = useRef(false);

  useEffect(() => {
    if (!dirty || !canSave) {
      pendingRef.current = false;
      return;
    }
    pendingRef.current = true;
    const timer = setTimeout(() => {
      pendingRef.current = false;
      saveRef.current();
    }, delayMs);
    return () => clearTimeout(timer);
  }, [key, dirty, canSave, delayMs]);

  useEffect(
    () => () => {
      if (pendingRef.current) saveRef.current();
    },
    [],
  );
}
