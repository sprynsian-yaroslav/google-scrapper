// Libs
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem, Spinner } from "reactstrap";
import { debounce, map, difference } from "lodash";
import classnames from "classnames";

// Components, Views, Screens
import Checkbox from "../../../../base/components/Checkbox";

// Hooks, Utils, Helpers
import { toggleSelectItem } from "../../../helpers/toggleSelectItem";
import { useService } from "../../../hooks/useService";
import { useLoading } from "../../../hooks/useLoading";
import KeywordsService from "../../../../services/KeywordsService";

// Styles, assets
import classes from "./EquipmentsDropdown.module.scss";
import ExercisesService from "../../../../services/ExercisesService";

const DEFAULT_LIMIT = 15

export const EquipmentsDropdown = ({ onChange, value = [], placeholder, label }) => {
    /**
     * @type {ExercisesService}
     */
    const exercisesService = useService(ExercisesService);

    const [isOpen, updateIsOpen] = useState(false);
    const [equipments, setEquipments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [nextOffset, setNextOffset] = useState(0);
    const [isLoading, { registerPromise }] = useLoading(true);
    const lastElementRef = useRef(null);

    const valueIds = map(value, 'id');
    const equipmentsIds = map(equipments, 'id');

    const showPlaceholder = !value?.length;

    const mapEquipmentsToDropdown = (data = []) => {
        return data.map((item) => ({ id: item.id, name: item.name }));
    };

    const isSelectedAll = useMemo(() => {
        return !(difference(equipmentsIds, valueIds).length);
    }, [valueIds, equipmentsIds]);

    const handleSelectAllValues = () => {
        if (isSelectedAll) {
            handleClear()
        } else {
            onChange(equipments);
        }
    };

    const handleClear = () => {
        onChange([]);
    };

    const loadEquipments = useCallback(() => {

        registerPromise(exercisesService.getEquipments())
            .then((result => {
                setEquipments([...equipments, ...mapEquipmentsToDropdown(result.data)]);
                setHasNextPage(result?.pagination?.nextOffset < result?.pagination?.totalCount);
                setNextOffset(result?.pagination?.nextOffset);
            }));
    }, [page]);

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
    }, [debounceSetNextPage, lastElementRef.current]);

    useEffect(() => {
        loadEquipments();
    }, [loadEquipments]);

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
                                ? placeholder && 'Select user segments'
                                : map(value, 'name').join(', ')
                        }
                            </span>
                        <i className={classnames('mdi mdi-chevron-down pointer-events-none user-select-none me-2', { 'mdi-rotate-180': isOpen })}/>
                    </DropdownToggle>

                    <DropdownMenu className="filter-menu pb-1 px-1 w-100 top-50" flip={false}>
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
                                    {equipments.map((item, index) => (
                                        <ListGroupItem className="bg-transparent border-0" key={item}>
                                            <Checkbox
                                                name="ingredientGroup"
                                                text={item.name}
                                                value={valueIds.includes(item.id)}
                                                onChange={() => toggleSelectItem(item, value, onChange)}
                                            />
                                            {
                                                index === equipments.length - 1
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

