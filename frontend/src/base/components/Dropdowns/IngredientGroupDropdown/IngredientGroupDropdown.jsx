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
import MetaNutritionApi from "../../../../services/MetaNutritionApi";

// Styles, assets
import classes from "./IngredientGroupDropdown.module.scss";

export const IngredientGroupDropdown = ({ onChange, value = [], placeholder, label }) => {
    /**
     * @type {MetaNutritionApi}
     */
    const metaNutritionApi = useService(MetaNutritionApi);

    const [isOpen, updateIsOpen] = useState(false);
    const [ingredientGroup, setIngredientGroup] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, { registerPromise }] = useLoading(true);
    const lastElementRef = useRef(null);

    const valueIds = map(value, 'id');
    const ingredientGroupIds = map(ingredientGroup, 'id');

    const showPlaceholder = !value?.length;

    const mapIngredientsToDropdown = (data = []) => {
        return data.map((item) => ({ id: item._id, name: item.name }));
    };

    const isSelectedAll = useMemo(() => {
        return !(difference(ingredientGroupIds, valueIds).length);
    }, [valueIds, ingredientGroupIds]);

    const handleSelectAllValues = () => {
        onChange(ingredientGroup);
    };

    const handleClear = () => {
        onChange([]);
    };

    const loadIngredientGroup = useCallback(() => {
        registerPromise(metaNutritionApi.getIngredientGroup(search, page))
            .then((result => {
                setIngredientGroup(mapIngredientsToDropdown(result.data));
                setHasNextPage(result?.meta?.hasNextPage);
            }));
    }, [search, page]);

    const setNextPage = () => {
        if (isLoading || !hasNextPage) return;
        setPage(page + 1);
    };

    const debounceSetNextPage = debounce(setNextPage, 300);

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
    }, [debounceSetNextPage]);

    useEffect(() => {
        loadIngredientGroup();
    }, [loadIngredientGroup]);

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
                        className={classnames('filter-toggle w-100', { 'with-border': isOpen })}
                        tag="section"
                    >
                    <span
                        className={classnames('ms-2 me-1 pointer-events-none user-select-none text-truncate', { 'text-secondary': showPlaceholder })}>
                        {
                            showPlaceholder
                                ? placeholder && 'Select ingredient group'
                                : map(value, 'name').join(', ')
                        }
                            </span>
                        <i className={classnames('mdi mdi-chevron-down pointer-events-none user-select-none', { 'mdi-rotate-180': isOpen })}/>
                    </DropdownToggle>

                    <DropdownMenu className="filter-menu pb-1 px-1 w-100 top-50" flip={false}>
                        <TableSearch onSearch={setSearch} search={search} className="my-2"/>

                        <section>
                            <ListGroup>
                                <ListGroupItem
                                    className={classnames("d-flex bg-transparent justify-content-between", classes.ServiceItem)}>
                                    <Checkbox name="selectAllValues"
                                              text="Select all"
                                              value={isSelectedAll}
                                              onChange={handleSelectAllValues}/>
                                    <button type="button"
                                            className="text-danger border-0 bg-transparent"
                                            onClick={handleClear}>
                                        Clear
                                    </button>
                                </ListGroupItem>

                                <div className={classnames(classes.ItemsWrapper, "custom-scrollbar")}>
                                    {ingredientGroup.map((item, index) => (
                                        <ListGroupItem className="bg-transparent border-0" key={item}>
                                            <Checkbox
                                                name="ingredientGroup"
                                                text={item.name}
                                                value={valueIds.includes(item.id)}
                                                onChange={() => toggleSelectItem(item, value, onChange)}
                                            />
                                            {
                                                index === ingredientGroup.length - 1
                                                    ? <div
                                                        ref={lastElementRef}
                                                        className="d-flex justify-content-center">
                                                        {isLoading && <Spinner size="xs" color="primary"/>}
                                                    </div>
                                                    : null
                                            }
                                        </ListGroupItem>
                                    ))}
                                </div>
                            </ListGroup>
                        </section>
                    </DropdownMenu>

                </Dropdown>
            </section>
        </>
    );
};

