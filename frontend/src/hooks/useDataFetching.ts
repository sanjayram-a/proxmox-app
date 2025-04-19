import { useState, useCallback } from 'react';

interface FetchingState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

type FetchFunction<T> = (...args: any[]) => Promise<T>;

interface UseDataFetchingResult<T> extends FetchingState<T> {
  fetchData: (...args: any[]) => Promise<void>;
  setData: (data: T | null) => void;
  clearError: () => void;
  reset: () => void;
}

interface UsePollingDataFetchingResult<T> extends UseDataFetchingResult<T> {
  startPolling: () => void;
  stopPolling: () => void;
}

export function useDataFetching<T>(
  fetchFn: FetchFunction<T>,
  initialData: T | null = null
): UseDataFetchingResult<T> {
  const [state, setState] = useState<FetchingState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  });

  const fetchData = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const result = await fetchFn(...args);
        setState({
          data: result,
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        setState({
          data: null,
          isLoading: false,
          error: error.message || 'An error occurred while fetching data',
        });
      }
    },
    [fetchFn]
  );

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    fetchData,
    setData,
    clearError,
    reset,
  };
}

export function usePollingDataFetching<T>(
  fetchFn: FetchFunction<T>,
  interval: number,
  initialData: T | null = null
): UsePollingDataFetchingResult<T> {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const {
    data,
    isLoading,
    error,
    fetchData,
    setData,
    clearError,
    reset: baseReset,
  } = useDataFetching(fetchFn, initialData);

  const startPolling = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    const id = setInterval(() => {
      fetchData();
    }, interval);
    setIntervalId(id);
  }, [fetchData, interval, intervalId]);

  const stopPolling = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  const reset = useCallback(() => {
    stopPolling();
    baseReset();
  }, [stopPolling, baseReset]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    setData,
    clearError,
    reset,
    startPolling,
    stopPolling,
  };
}

interface PaginatedData<T> {
  data: T[];
  total: number;
}

interface UsePaginatedDataFetchingResult<T>
  extends Omit<UseDataFetchingResult<T[]>, 'fetchData'> {
  page: number;
  pageSize: number;
  total: number;
  fetchPage: (page: number) => Promise<void>;
}

export function usePaginatedDataFetching<T>(
  fetchFn: (page: number, limit: number) => Promise<PaginatedData<T>>,
  pageSize: number = 10
): UsePaginatedDataFetchingResult<T> {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const {
    data,
    isLoading,
    error,
    fetchData: baseFetchData,
    setData,
    clearError,
    reset,
  } = useDataFetching<T[]>(async () => {
    const response = await fetchFn(page, pageSize);
    setTotal(response.total);
    return response.data;
  });

  const fetchPage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      return baseFetchData();
    },
    [baseFetchData]
  );

  return {
    data,
    isLoading,
    error,
    page,
    pageSize,
    total,
    fetchPage,
    setData,
    clearError,
    reset,
  };
}

export default useDataFetching;
