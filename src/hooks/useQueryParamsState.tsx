import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface UseQueryParamsStateReturn {
  queryParams: URLSearchParams;
  setQueryParams: (attr: string, value: string) => void;
  removeQueryParams: (attr: string) => void;
  clearAllQueryParams: () => void;
}

/**
 * The hook to get & set query params to the current url
 * @returns getter and setter
 */
export const useQueryParamsState = (): UseQueryParamsStateReturn => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const nagivateWithQueryParams = useCallback(() => {
    navigate(`${location.pathname}?${queryParams}`);
  }, [location.pathname, navigate, queryParams]);

  const setQueryParams = useCallback(
    (attr: string, value: string) => {
      queryParams.set(attr, value);
      nagivateWithQueryParams();
    },
    [nagivateWithQueryParams, queryParams],
  );
  const removeQueryParams = useCallback(
    (attr: string) => {
      queryParams.delete(attr);
      nagivateWithQueryParams();
    },
    [nagivateWithQueryParams, queryParams],
  );

  const clearAllQueryParams = useCallback(() => {
    const params = Object.fromEntries(queryParams.entries());
    Object.entries(params).forEach((x) => queryParams.delete(x[0]));
  }, [queryParams]);

  return {
    queryParams,
    setQueryParams,
    removeQueryParams,
    clearAllQueryParams,
  };
};
