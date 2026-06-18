import { useCallback, useEffect, useState } from "react";

export const useAsync = <T,>(loader: () => Promise<T>, immediate = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await loader();
      setData(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load data.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    if (immediate) {
      void execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
};
