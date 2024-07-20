// Libs
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem, Spinner } from "reactstrap";
import { debounce, map, difference } from "lodash";
import classnames from "classnames";

// Components, Views, Screens
import TableSearch from "../../../../base/components/Table/tableSearch";
import Checkbox from "../../../../base/components/Checkbox";

// Hooks, Utils, Helpers
import { toggleSelectItem } from "../../../helpers/toggleSelectItem";
import { useService } from "../../../hooks/useService";
import { useLoading } from "../../../hooks/useLoading";
import UserSegmentsService from "../../../../services/UserSegmentsService";

// Styles, assets
import classes from "./UserSegmentsDropdown.module.scss";
import { useHighlight } from "../../../hooks/useHighlight";

const DEFAULT_LIMIT = 15;

const MIN_SEARCH_LENGTH = 3;

export const UserSegmentsDropdown = ({ onChange, value = [], placeholder, label, withoutSelectAllOption = false }) => {
    /**
     * @type {UserSegmentsService}
     */
    const userSegmentsService = useService(UserSegmentsService);

    const [isOpen, updateIsOpen] = useState(false);
    const [userSegments, setUserSegments] = useState([]);
    const [search, setSearch] = useState("");
    const [prevSearchRequest, setPrevSearchRequest] = useState("");
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, { registerPromise }] = useLoading(true);
    const lastElementRef = useRef(null);


    const valueIds = map(value, 'id');
    const ingredientGroupIds = map(userSegments, 'id');

    const showPlaceholder = !value?.length;

    const searchRequest = useMemo(() => {
            let newSearch = search && search.toString()?.trim()?.length >= MIN_SEARCH_LENGTH ? search : '';

            if (newSearch !== prevSearchRequest) {
                setUserSegments([]);
                setHasNextPage(true);
                setPage(1);
            }

            setPrevSearchRequest(newSearch);

            return newSearch;
        },
        [search]);

    const handleChangeSearch = (search) => {
        setSearch(search);
    };

    const { decorateText } = useHighlight(searchRequest);

    const mapSegmentToDropdown = (data = []) => {
        return data.map((item) => ({ id: item.id, name: item.fullName }));
    };

    const isSelectedAll = useMemo(() => {
        return !(difference(ingredientGroupIds, valueIds).length);
    }, [valueIds, ingredientGroupIds]);

    const handleSelectAllValues = () => {
        isSelectedAll ? onChange([]) : onChange(userSegments);
    };

    const handleClear = () => {
        onChange([]);
    };

    const setNextPage = () => {
        if (isLoading || !hasNextPage) return;
        setPage(page + 1);
    };

    const debounceSetNextPage = debounce(setNextPage, 300);

    const loadSegments = useCallback(() => {

        const nextOffset = (page - 1) * DEFAULT_LIMIT;

        const params = { limit: DEFAULT_LIMIT, offset: nextOffset, query: searchRequest };

        registerPromise(userSegmentsService.getSegments(params))
            .then((result => {
                setUserSegments([...userSegments, ...mapSegmentToDropdown(result.data)]);
                setHasNextPage(result?.pagination?.nextOffset < result?.pagination?.totalCount);
            }));
    }, [page, searchRequest, userSegments]);

    useEffect(() => {
        if (!lastElementRef.current) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                debounceSetNextPage();
            }
        });

        observer.observe(lastElementRef.current);

        return () => {
            observer.disconnect();
        };
    }, [debounceSetNextPage, lastElementRef.current]);

    useEffect(() => {
        loadSegments();
    }, [page, searchRequest]);

    return (<>
            {!!label && <label>{label}</label>}
            <section className="d-flex align-items-center w-100">
                <Dropdown
                    isOpen={isOpen}
                    toggle={() => updateIsOpen(prevState => !prevState)}
                    className="d-inline-block filter-dropdown cursor-pointer result-filter w-100"
                    direction="down"
                >
                    <DropdownToggle
                        className={classnames('filter-toggle max-w-100 pe-0', { 'with-border': isOpen })}
                        tag="section"
                    >
                    <span
                        className={classnames('ms-2 me-1 pointer-events-none user-select-none text-truncate', { 'text-secondary': showPlaceholder })}>
                        {
                            showPlaceholder
                                ? placeholder || 'Select user segments'
                                : map(value, 'name').join(', ')
                        }
                            </span>
                        <i className={classnames('mdi mdi-chevron-down pointer-events-none user-select-none me-2', { 'mdi-rotate-180': isOpen })}/>
                    </DropdownToggle>

                    <DropdownMenu className="filter-menu pb-1 px-1 w-100 top-50" flip={false}>
                        <TableSearch onSearch={handleChangeSearch} search={search} className="my-2"/>

                        <section>
                            <ListGroup>
                                <ListGroupItem
                                    className={classnames("d-flex bg-transparent justify-content-between", classes.ServiceItem)}>
                                    <div>
                                        {!withoutSelectAllOption && <Checkbox
                                            name="selectAllValues"
                                            text="Select all"
                                            value={isSelectedAll}
                                            onChange={handleSelectAllValues}
                                        />}
                                    </div>
                                    <button type="button"
                                            className="text-danger border-0 bg-transparent"
                                            onClick={handleClear}>
                                        Clear
                                    </button>
                                </ListGroupItem>

                                <div className={classnames(classes.ItemsWrapper, "custom-scrollbar")}>
                                    {userSegments.map((item, index) => (
                                        <ListGroupItem className="bg-transparent border-0" key={item.id}>
                                            <Checkbox
                                                name="ingredientGroup"
                                                text={<div {...decorateText(item.name)} />}
                                                value={valueIds.includes(item.id)}
                                                onChange={() => toggleSelectItem(item, value, onChange)}
                                            />
                                            {
                                                index === userSegments.length - 1
                                                    ? <div
                                                        ref={lastElementRef}
                                                        className="d-flex justify-content-center">
                                                    </div>
                                                    : null
                                            }
                                        </ListGroupItem>
                                    ))}
                                    {isLoading && <div className="d-flex my-2 justify-content-center">
                                        <Spinner size="xs" color="primary"/>
                                    </div>}
                                </div>
                            </ListGroup>
                        </section>
                    </DropdownMenu>
                </Dropdown>
            </section>
        </>
    );
};

