import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

import Table from "../../../../../../base/components/Table";
import {
    SearchPlaceholder,
    TableHeader,
    columns,
    NoScrapingResultsPlaceholder,
} from "./components";

import { DEFAULT_TABLE_LIMIT } from "../../../../../../base/constants/shared";
import {
    usePaginationProvider,
    useLocationSource,
    useSearchProvider,
} from "../../../../../../base/components/Table/hooks";
import { useService } from "../../../../../../base/hooks/useService";
import { useLoading } from "../../../../../../base/hooks/useLoading";
import { useQueryString } from "../../../../../../base/hooks/useQueryString";
import ScrapingResultService from "../../../../../../services/ScrapingResultService";
import { LIMIT_OPTIONS } from "./constants";

export default function ScrapingResultsList({ keywordId }) {
    /**
     * @type {ScrapingResultService}
     */
    const scrapingResultService = useService(ScrapingResultService);

    const [isLoading, { registerPromise }] = useLoading(true);
    const { search: locationSearch, pathname } = useLocation();
    const {
        params: {
            limit = DEFAULT_TABLE_LIMIT,
            offset = 0,
            search,
        }
    } = useQueryString(locationSearch);

    const [scrapingResults, updateScrapingResults] = useState([]);
    const [pagination, updatePagination] = useState({});

    const locationSource = useLocationSource();

    const paginationProvider = usePaginationProvider({
        source: locationSource,
        alias: "offset",
        scope: "",
        fallback: 0
    });

    const searchProvider = useSearchProvider({
        source: locationSource,
        scope: "",
        alias: 'search',
        onApplyClearScope: ["offset"]
    });

    const limitProvider = usePaginationProvider({
        source: locationSource,
        alias: "limit",
        scope: "",
        fallback: 10,
        onApplyClearScope: ["offset"]
    });

    const getScrapingResults = useCallback(() => {
        registerPromise(scrapingResultService.getResults(keywordId,{
            limit,
            offset,
            search,
        }).then(({ data, pagination }) => {
            updateScrapingResults(data);
            updatePagination(pagination);
        }));
    }, [limit, offset, search, keywordId]);


    useEffect(() => {
        getScrapingResults();
    }, [getScrapingResults]);

    return (
            <Table
                columns={scrapingResults?.length ? columns : []}
                data={scrapingResults}
                loading={isLoading}
                HeaderComponent={TableHeader}
                totalCount={pagination?.totalCount || 0}
                limit={limitProvider.getValue()}
                offset={offset}
                paginationProvider={paginationProvider}
                searchProvider={searchProvider}
                commonPlaceholder={<NoScrapingResultsPlaceholder/>}
                placeholderForSearch={<SearchPlaceholder/>}
                isLimitEditable
                limitProvider={limitProvider}
                limitOptions={LIMIT_OPTIONS}
            />
    );
}
