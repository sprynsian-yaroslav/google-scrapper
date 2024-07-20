// Libs
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem, Spinner } from "reactstrap";
import { map, difference } from "lodash";
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
import classes from "./RecipeTagDropdown.module.scss";

export const RecipeTagDropdown = ({ onChange, value = [], placeholder, label }) => {
    /**
     * @type {MetaNutritionApi}
     */
    const metaNutritionApi = useService(MetaNutritionApi);

    const [isOpen, updateIsOpen] = useState(false);
    const [recipeTag, setRecipeTag] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, { registerPromise }] = useLoading(true);

    const valueIds = map(value, 'id');
    const ingredientGroupIds = map(recipeTag, 'id');

    const showPlaceholder = !value?.length;

    const mapIngredientsToDropdown = (data = []) => {
        return data.map((item) => ({ id: item._id, name: item.title }));
    };

    const isSelectedAll = useMemo(() => {
        return !(difference(ingredientGroupIds, valueIds).length);
    }, [valueIds, ingredientGroupIds]);

    const filteredRecipeTag = useMemo(() => {
        return recipeTag.filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()))
    }, [recipeTag, search])

    const handleSelectAllValues = () => {
        onChange(recipeTag);
    };

    const handleClear = () => {
        onChange([]);
    };

    const loadRecipeTag = useCallback(() => {
        registerPromise(metaNutritionApi.getRecipeTag())
            .then((result => {
                setRecipeTag(mapIngredientsToDropdown(result.data));
            }));
    }, []);


    useEffect(() => {
        loadRecipeTag();
    }, [loadRecipeTag]);

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
                                    {filteredRecipeTag.map((item, index) => (
                                        <ListGroupItem className="bg-transparent border-0" key={item}>
                                            <Checkbox
                                                name="recipeTag"
                                                text={item.name}
                                                value={valueIds.includes(item.id)}
                                                onChange={() => toggleSelectItem(item, value, onChange)}
                                            />
                                            {
                                                index === filteredRecipeTag.length - 1
                                                    ? <div
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

