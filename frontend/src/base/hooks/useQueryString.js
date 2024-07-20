import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import qs from "query-string";

export const parseQuery = (query) => {
  return qs.parse(query, {
    parseBooleans: true,
    parseNumbers: true,
    ignoreQueryPrefix: true,
  });
};

export const stringifyParams = (params) => {
  return qs.stringify(params);
};

export const useQueryString = (search, onChange) => {
  const navigate = useNavigate();

  const handleStringifySearch = useCallback(
    (parsedSearch) => {
      onChange(qs.stringify(parsedSearch));
    },
    [onChange]
  );

  const params = useMemo(() => {
    return parseQuery(search);
  }, [search]);

  const get = useCallback(
    (key) => {
      return params[key];
    },
    [params]
  );

  const remove = useCallback(
    (key) => {
      const deletedItem = params[key];
      if (!deletedItem) return;

      delete params[key];

      handleStringifySearch(params);
      return deletedItem;
    },
    [params, handleStringifySearch]
  );

  const merge = useCallback(
    (key, value) => {
      params[key] = value;
      handleStringifySearch(params);
    },
    [params, handleStringifySearch]
  );

  const getAll = useCallback(() => {
    return params;
  }, [params]);

  const setNewSearch = useCallback((params) => {
    navigate({
      search: qs.stringify(params),
    });
  }, []);

  const clear = useCallback(() => {
    handleStringifySearch({});
    return {};
  }, [handleStringifySearch]);

  return { get, remove, merge, getAll, clear, params, setNewSearch };
};

export const useLocationQuery = () => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const handleChangeLocation = useCallback(
    (parsedSearch) => {
      navigate(`${pathname}?${parsedSearch}`);
    },
    [pathname, navigate]
  );

  return useQueryString(search, handleChangeLocation);
};
