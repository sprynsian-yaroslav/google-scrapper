import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import Table from "../../../../../base/components/Table";
import ConfirmPopup from "../../../../../base/components/ConfirmPopup";
import {
    SearchPlaceholder,
    TableHeader,
    columns,
    NoUserSegmentsPlaceholder, USER_SEGMENTS_ACTIONS
} from "./components";

import { DEFAULT_TABLE_LIMIT } from "../../../../../base/constants/shared";
import {
    usePaginationProvider,
    useLocationSource,
    useSearchProvider, useSortProvider
} from "../../../../../base/components/Table/hooks";
import ToasterService from "../../../../../services/ToastService";
import { useService } from "../../../../../base/hooks/useService";
import { useLoading } from "../../../../../base/hooks/useLoading";
import { useQueryString } from "../../../../../base/hooks/useQueryString";
import UserSegmentsService from "../../../../../services/UserSegmentsService";
import { LIMIT_OPTIONS, MIN_SEARCH_LENGTH } from "../constants";
import { USER_SEGMENTS_GROUP_LINKS } from "../../config";

export default function UserSegmentsList() {
    /**
     * @type {UserSegmentsService}
     */
    const userSegmentsService = useService(UserSegmentsService);
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

    const [userSegments, updateUserSegments] = useState([]);
    const [userSegmentsPagination, updateUserSegmentsPagination] = useState({});
    const [showDeletePopup, updateShowDeletePopup] = useState(null);

    const locationSource = useLocationSource();

    const searchRequest = useMemo(() => search && search.toString()?.trim()?.length >= MIN_SEARCH_LENGTH
        ? search
        : null,
        [search])

    const sortKeys = ["fullName", "priority"];
    const getSortScope = (key) => [...sortKeys.filter(item => item !== key), "offset"];

    const nameSortProvider = useSortProvider({
        source: locationSource,
        alias: "fullName",
        scope: "",
        onApplyClearScope: getSortScope("fullName")
    });

    const prioritySortProvider = useSortProvider({
        source: locationSource,
        alias: "priority",
        scope: "",
        onApplyClearScope: getSortScope("priority")
    });

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


    const getSegments = useCallback(() => {
        const [orderBy, orderType] = Object.entries({
            fullName,
            priority,
        }).find(([_, value]) => value) || [];

        registerPromise(userSegmentsService.getSegments({
            limit,
            offset,
            query: searchRequest,
            orderBy,
            orderType
        }).then(({ data, pagination }) => {
            updateUserSegments(data);
            updateUserSegmentsPagination(pagination);
        }));
    }, [limit, offset, searchRequest, fullName, priority]);

    const handleClickDeleteSegment = (segmentId) => {
        updateShowDeletePopup(segmentId);
    };

    const handleClickEditSegment = (segmentId) => {
        const queryParams = new URLSearchParams({ editSegmentId: segmentId }).toString();
        navigate(`${USER_SEGMENTS_GROUP_LINKS.CREATE_EDIT_SEGMENTS}?${queryParams}`)
    };

    const handleClickCopySegment = (segmentId) => {
        userSegmentsService.copySegment(segmentId)
            .then((data) => {
                const queryParams = new URLSearchParams({ editSegmentId: data.id }).toString();
                navigate(`${USER_SEGMENTS_GROUP_LINKS.CREATE_EDIT_SEGMENTS}?${queryParams}`)
            })
    };

    const deleteSegment = (segmentId) => {
        registerPromise(userSegmentsService.deleteSegments(segmentId))
            .then(() => {
                getSegments();
                toastService.success("The user segment has been successfully deleted");
            });
    };

    useEffect(() => {
        getSegments();
    }, [getSegments]);

    return (
        <>
            <Table
                columns={userSegments.length ? columns : []}
                data={userSegments}
                loading={isLoading}
                HeaderComponent={TableHeader}
                totalCount={userSegmentsPagination.totalCount}
                limit={limitProvider.getValue()}
                offset={offset}
                paginationProvider={paginationProvider}
                searchProvider={searchProvider}
                commonPlaceholder={<NoUserSegmentsPlaceholder/>}
                placeholderForSearch={<SearchPlaceholder/>}
                actions={{
                    [USER_SEGMENTS_ACTIONS.DELETE]: handleClickDeleteSegment,
                    [USER_SEGMENTS_ACTIONS.EDIT]: handleClickEditSegment,
                    [USER_SEGMENTS_ACTIONS.COPY]: handleClickCopySegment
                }}
                sortProviders={{
                    fullName: nameSortProvider,
                    priority: prioritySortProvider
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
                    title="Delete user segment"
                    description="Are you sure you want to delete the chosen user segment?"
                    submitBtnText="Delete"
                    className="upload-manually__popup"
                />
            }
        </>
    );
}
