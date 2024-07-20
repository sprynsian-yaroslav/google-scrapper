import { useCallback, useState, useEffect } from 'react';
import { useLocationQuery, stringifyParams } from './useQueryString';
import { useNavigate } from 'react-router-dom';
import { useLoading } from './useLoading';

/**
 * 
 * @param {string} searchQueryParam
 * @param {string} sortTypeQueryParam 
 * @param {string} sortByQueryParam 
 * @param {Function} getNewDataService 
 * @param {number} limit 
 * 
 * @param {Object} sortTransformerMap 
 * @param {Object} sortTypeTransdormMap 
 * 
 * @returns {[boolean, {totalCount: number, nextOffset: number}, data: Array, handleTableChange: Function ]}
 */

export const useTable = ({
    searchQueryParam = "query",
    sortTypeQueryParam = "sortType",
    sortByQueryParam = "sortBy",
    getNewDataService = () => { },
    limit = 10,
    sortTransformerMap = null, //for [.net] backend
    sortTypeTransdormMap = null, //for custom sort types asc -> desc -> default -> etc.
}) => {
    const navigate = useNavigate();
    const { params } = useLocationQuery();
    const [loading, { disable, enable }] = useLoading();

    const [pagination, updatePagination] = useState({ totalCount: 0, nextOffset: limit })
    const [data, updateData] = useState([]);

    const handleTableChange = useCallback(
        (type, { page, searchText, sortField, sortOrder }) => {
            const newParams = {
                ...params,
                offset: limit * (page - 1),
                [searchQueryParam]: searchText.trimLeft().trimRight(),
                [sortByQueryParam]: sortField,
                [sortTypeQueryParam]: sortOrder,
            }

            if (sortTransformerMap) {
                newParams[sortByQueryParam] = sortTransformerMap[sortField];
            }

            if (sortTypeTransdormMap) {
                newParams[sortTypeQueryParam] = sortTypeTransdormMap[sortOrder];
            }

            navigate({
                search: stringifyParams(newParams),
            })
        }, []);

    const downloadNewData = useCallback(
        async () => {
            try {
                enable();
                await new Promise((resolve) => setTimeout(resolve, 300));
                const { data, pagination } = await getNewDataService({
                    ...params,
                    limit,
                });
                updateData(data);
                updatePagination(pagination)
            } finally {
                disable(false);
            }
        },
        [params],
    )

    useEffect(() => {
        downloadNewData();
    }, [downloadNewData])

    return [loading, pagination, data, handleTableChange];
}