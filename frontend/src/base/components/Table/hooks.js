import { useCallback, useMemo, useState } from "react";
import lGet from 'lodash.get'
import lSet from 'lodash.set'
import { useLocationQuery } from "../../hooks/useQueryString";
import { formatFromISOToJSDate } from "../../helpers/date";

export const useLocalSource = () => {
  const [data, seState] = useState({})

  const get = useCallback((key) => {
    return lGet(data, key)
  }, [data])

  const set = useCallback((key, value) => {
    seState(state => {
      lSet(state, key, value)
      return { ...state }
    })
  }, [])

  const remove = useCallback((key) => {
    set(key, undefined)
  }, [set])

  return { get, set, remove }
}

export const useLocationSource = () => {
  const { get, remove, merge } = useLocationQuery();
  return {
    get,
    set: merge,
    remove,
  }
}

export const useSourceProvider = ({ source, scope, alias, fallback, onApplyClearScope = [] }) => {
  const key = [scope, alias].filter(Boolean).join('.');

  const data = useMemo(() => {
    const val = source.get(key) || fallback
    return { [alias]: val };
  }, [source, key, alias, fallback]);

  const setValue = useCallback((value) => {
    onApplyClearScope.forEach(scopeToClear => source.remove(scopeToClear))
    source.set(key, value);
  }, [key, source, onApplyClearScope])

  const getValue = () => {
    return data[alias]
  }

  const toObject = () => {

  }

  return { setValue, getValue }
}

export const useSortProvider = ({ source, alias, scope = "sort", onApplyClearScope = ["sort"] }) => {
  return useSourceProvider({
    source,
    alias,
    scope,
    onApplyClearScope
  })
}

export const useFilterProvider = ({ source, alias, scope = "filters", onApplyClearScope = ["pagination.offset"] }) => {
  return useSourceProvider({
    source,
    alias,
    scope,
    onApplyClearScope
  })
}

export const useSearchProvider = ({
  source,
  scope = "search",
  alias = 'q',
  onApplyClearScope = ["pagination.offset"]
}) => {
  return useSourceProvider({
    source,
    scope,
    alias,
    onApplyClearScope
  })
}

export const usePaginationProvider = ({ source, alias, scope = "pagination", onApplyClearScope = [], fallback }) => {
  return useSourceProvider({
    source,
    alias,
    fallback,
    scope,
    onApplyClearScope
  })
}

export const parseSorting = (sorting) => {
  const currentSorting = Object.entries(sorting).filter(([name, value]) => !!name && !!value).flat(1);
  if (!currentSorting.length) return {};
  return {
    orderBy: currentSorting[0],
    orderType: currentSorting[1]
  }
}

export const useDateRangeSourceProvider = ({ source, alias = [], fallback, onApplyClearScope = [] }) => {
  const data = useMemo(() => {
    return alias.reduce((prevValue, currValue) => ({ ...prevValue, [currValue]: source.get(currValue) || fallback }), {})
  }, [source, alias, fallback]);

  const setValue = useCallback((values = {}) => {
    onApplyClearScope.forEach(scopeToClear => source.remove(scopeToClear))
    alias.forEach((key => source.set(key, values[key])));
  }, [source, onApplyClearScope, alias])

  const getValue = () => {
    return alias.map(key => formatFromISOToJSDate(data[key]))
  }

  return { setValue, getValue, alias }
}

export const useDateRangeProvider = ({ source, alias = [], onApplyClearScope = ["offset"], fallback }) => {
  return useDateRangeSourceProvider({
    source,
    alias,
    onApplyClearScope,
    fallback
  })
}