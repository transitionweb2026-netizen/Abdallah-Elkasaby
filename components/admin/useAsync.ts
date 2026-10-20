"use client";

import { useCallback, useState } from "react";
import { CmsError } from "@/lib/cms/store/types";

type AsyncState = { pending: boolean; error: string | null; success: string | null };

/** Runs an admin action, tracking a pending/error/success state the UI can show directly. */
export function useAsync() {
  const [state, setState] = useState<AsyncState>({ pending: false, error: null, success: null });

  const run = useCallback(async (action: () => Promise<void>, successMessage?: string) => {
    setState({ pending: true, error: null, success: null });
    try {
      await action();
      setState({ pending: false, error: null, success: successMessage ?? null });
    } catch (error) {
      const message = error instanceof CmsError || error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setState({ pending: false, error: message, success: null });
    }
  }, []);

  const clear = useCallback(() => setState({ pending: false, error: null, success: null }), []);

  return { ...state, run, clear };
}
