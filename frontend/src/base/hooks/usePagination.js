import { useCallback, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { parseQuery, stringifyParams } from "./useQueryString";

const useAllQueryParams = () => {
  const { search } = useLocation();
  return useMemo(() => parseQuery(search), [search]);
};

const usePaginationParams = () => {
  const { limit, offset } = useAllQueryParams();
  return useMemo(() => ({ limit, offset }), [offset, limit]);
};

const useUpdatePagination = () => {
  const params = useAllQueryParams();
  const navigate = useNavigate();

  const goToPage = useCallback(
    (limit, offset) => {
      const newParams = {
        ...params,
        limit,
        offset,
      };

      navigate({
        search: stringifyParams(newParams),
      });
    },
    [params, navigate]
  );

  return goToPage;
};

export const usePagination = () => {
  const params = usePaginationParams();
  const [total, updateTotal] = useState(0);

  return [params, total, useUpdatePagination(), updateTotal];
};
