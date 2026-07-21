import { useState, useCallback } from "react";
import { AppError, mapSupabaseError } from "../errors";

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useAsyncOperation<T = any>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>): Promise<T | null> => {
    setState({ data: null, isLoading: true, error: null });
    try {
      const result = await asyncFunction();
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (err: any) {
      const appErr: AppError = mapSupabaseError(err);
      setState({ data: null, isLoading: false, error: appErr.message });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
