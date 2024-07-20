import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from "react-router-dom";

import Table from "../../../../../base/components/Table";
import ConfirmPopup from "../../../../../base/components/ConfirmPopup";
import { CreateEditAttribute } from "./CreateEditAttribute";

import { SearchPlaceholder, TableHeader, columns, NoAttributePlaceholder, ATTRIBUTE_ACTIONS } from "./components";
import { DEFAULT_TABLE_LIMIT } from "../../../../../base/constants/shared";
import {
    usePaginationProvider,
    useLocationSource,
    useSearchProvider, useSortProvider,
} from "../../../../../base/components/Table/hooks";
import ToasterService from "../../../../../services/ToastService";
import { useService } from "../../../../../base/hooks/useService";
import { useLoading } from "../../../../../base/hooks/useLoading";
import { useQueryString } from "../../../../../base/hooks/useQueryString";
import UserSegmentsService from "../../../../../services/UserSegmentsService";
import { LIMIT_OPTIONS, MIN_SEARCH_LENGTH } from "../constants";


export default function AttributesList() {
    /**
     * @type {UserSegmentsService}
     */
    const userSegmentsService = useService(UserSegmentsService);
    /**
     * @type {ToasterService}
     */
    const toastService = useService(ToasterService);

    const [showFormPopup, updateShowFormPopup] = useState(false);
    const [editAttribute, setEditAttribute] = useState(null);

    const [isLoading, { registerPromise }] = useLoading(true);
    const { search: locationSearch, pathname } = useLocation();
    const {
        params: {
            limit = DEFAULT_TABLE_LIMIT,
            offset = 0,
            search
        }
    } = useQueryString(locationSearch);

    const [attributes, updateAttributes] = useState([]);
    const [attributesPagination, updateAttributesPagination] = useState({});
    const [showDeletePopup, updateShowDeletePopup] = useState(null);

    const searchRequest = useMemo(() => search && search.toString()?.trim()?.length >= MIN_SEARCH_LENGTH
            ? search
            : null,
        [search])

    const locationSource = useLocationSource();
    const {
        params: {
            label,
            name,
            attributeCategory,
        }
    } = useQueryString(locationSearch);

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

    const sortKeys = ["label", "attributeCategory"];
    const getSortScope = (key) => [...sortKeys.filter(item => item !== key), "offset"];

    const labelSortProvider = useSortProvider({
        source: locationSource,
        alias: "label",
        scope: "",
        onApplyClearScope: getSortScope("label")
    });

    const nameSortProvider = useSortProvider({
        source: locationSource,
        alias: "name",
        scope: "",
        onApplyClearScope: getSortScope("name")
    });

    const attributeCategoryAtSortProvider = useSortProvider({
        source: locationSource,
        alias: "attributeCategory",
        scope: "",
        onApplyClearScope: getSortScope("attributeCategory")
    });

    const limitProvider = usePaginationProvider({
        source: locationSource,
        alias: "limit",
        scope: "",
        fallback: 10,
        onApplyClearScope: ["offset"]
    });

    const getAttributes = useCallback(() => {
        const [orderBy, orderType] = Object.entries({
            label,
            "attributeCategory.name": attributeCategory,
            name,
        }).find(([_, value]) => value) || [];

        registerPromise(userSegmentsService.getAttributes({
            limit,
            offset,
            orderBy,
            orderType,
            query: searchRequest
        }).then(({ data, pagination }) => {
            updateAttributes(data);
            updateAttributesPagination(pagination);
        }));
    }, [limit, offset, searchRequest, label, name, attributeCategory]);

    const handleClickDeleteAttribute = (attribute) => {
        updateShowDeletePopup(attribute);
    };

    const handleClickEditAttribute = (attribute) => {
        updateShowFormPopup(true);
        setEditAttribute(attribute)
    };

    const deleteAttribute = (id) => {
        registerPromise(userSegmentsService.deleteAttribute(id))
            .then(() => {
                getAttributes();
                toastService.success("The attribute has been successfully deleted");
            });
    };

    useEffect(() => {
        getAttributes();
    }, [getAttributes]);

    return (
        <>
            <Table
                columns={attributes.length ? columns : []}
                data={attributes}
                loading={isLoading}
                HeaderComponent={TableHeader}
                totalCount={attributesPagination.totalCount}
                limit={limitProvider.getValue()}
                offset={offset}
                paginationProvider={paginationProvider}
                searchProvider={searchProvider}
                commonPlaceholder={<NoAttributePlaceholder/>}
                placeholderForSearch={<SearchPlaceholder/>}
                actions={{
                    [ATTRIBUTE_ACTIONS.DELETE]: handleClickDeleteAttribute,
                    [ATTRIBUTE_ACTIONS.EDIT]: handleClickEditAttribute
                }}
                sortProviders={{
                    label: labelSortProvider,
                    attributeCategory: attributeCategoryAtSortProvider,
                    name: nameSortProvider
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
                        deleteAttribute(showDeletePopup);
                        updateShowDeletePopup(null);
                    }}
                    title="Delete attribute"
                    description="Are you sure you want to delete the chosen attribute?"
                    submitBtnText="Delete"
                    className="upload-manually__popup"
                />
            }

            {showFormPopup && <CreateEditAttribute
                isOpen={showFormPopup}
                close={() => {
                    updateShowFormPopup(false)
                    setEditAttribute(null)
                }}
                afterSubmit={() => getAttributes()}
                selectedAttribute={editAttribute}
            />}
        </>
    );
}
