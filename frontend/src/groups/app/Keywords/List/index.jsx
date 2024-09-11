import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import Table from "../../../../base/components/Table";
import ConfirmPopup from "../../../../base/components/ConfirmPopup";
import {
    SearchPlaceholder,
    TableHeader,
    columns,
    NoKeywordsPlaceholder,
    KEYWORDS_ACTIONS
} from "./components";

import { DEFAULT_TABLE_LIMIT } from "../../../../base/constants/shared";
import {
    usePaginationProvider,
    useLocationSource,
    useSearchProvider,
} from "../../../../base/components/Table/hooks";
import ToasterService from "../../../../services/ToastService";
import { useService } from "../../../../base/hooks/useService";
import { useLoading } from "../../../../base/hooks/useLoading";
import { useQueryString } from "../../../../base/hooks/useQueryString";
import KeywordsService from "../../../../services/KeywordsService";
import { LIMIT_OPTIONS } from "./constants";
import { CreateKeywords } from "../CreateKeywords";
import BaseLayoutWithCard from "../../../../base/components/BaseLayoutWithCard";


const breadcrumbs = {
    title: "Keywords", breadcrumbItems: []
};

export default function KeywordsList() {
    /**
     * @type {KeywordsService}
     */
    const keywordsService = useService(KeywordsService);
    /**
     * @type {ToasterService}
     */
    const toastService = useService(ToasterService);
    const navigate = useNavigate();

    const [isLoading, { registerPromise }] = useLoading(true);
    const { search: locationSearch, pathname } = useLocation();
    const {
        params: {
            limit = DEFAULT_TABLE_LIMIT,
            offset = 0,
            search,
            fullName,
            priority
        }
    } = useQueryString(locationSearch);

    const [keywords, updateKeywords] = useState([]);
    const [pagination, updatePagination] = useState({});
    const [showDeletePopup, updateShowDeletePopup] = useState(null);
    const [showFormPopup, updateShowFormPopup] = useState(false);


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

    const getKeywords = useCallback(() => {
        registerPromise(keywordsService.getKeywords({
            limit,
            offset,
            search,
        }).then(({ data, pagination }) => {
            updateKeywords(data);
            updatePagination(pagination);
        }));
    }, [limit, offset, search, fullName, priority]);

    const handleClickDeleteSegment = (segmentId) => {
        updateShowDeletePopup(segmentId);
    };

    const deleteSegment = (id) => {
        registerPromise(keywordsService.deleteKeywords(id))
            .then(() => {
                getKeywords();
                toastService.success("The keyword has been successfully deleted");
            });
    };

    useEffect(() => {
        getKeywords();
    }, [getKeywords]);

    return (
        <BaseLayoutWithCard breadcrumbs={breadcrumbs} >
            <Table
                columns={keywords?.length ? columns : []}
                data={keywords}
                loading={isLoading}
                HeaderComponent={TableHeader}
                totalCount={pagination.totalCount}
                limit={limitProvider.getValue()}
                offset={offset}
                paginationProvider={paginationProvider}
                searchProvider={searchProvider}
                commonPlaceholder={<NoKeywordsPlaceholder/>}
                placeholderForSearch={<SearchPlaceholder/>}
                isRowClick
                actions={{
                    [KEYWORDS_ACTIONS.DELETE]: handleClickDeleteSegment,
                }}
                headerActions={{
                    goToCreate: () => updateShowFormPopup(true),
                }}
                isLimitEditable
                limitProvider={limitProvider}
                limitOptions={LIMIT_OPTIONS}
            />
            {showDeletePopup &&
                <ConfirmPopup
                    isOpen={showDeletePopup}
                    updateIsOpen={updateShowDeletePopup}
                    onSubmit={() => {
                        deleteSegment(showDeletePopup);
                        updateShowDeletePopup(null);
                    }}
                    title="Delete keyword"
                    description="Are you sure you want to delete the chosen keywords?"
                    submitBtnText="Delete"
                    className="upload-manually__popup"
                />
            }

            {showFormPopup && <CreateKeywords
                isOpen={showFormPopup}
                close={() => {
                    updateShowFormPopup(false)
                }}
                afterSubmit={() => getKeywords()}
            />}
        </BaseLayoutWithCard>
    );
}
