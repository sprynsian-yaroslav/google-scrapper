import React, { useEffect, useMemo, useRef, useState } from "react";
import { debounce, difference, flatten, isEmpty, keyBy, map, mapValues, omit, sortBy } from "lodash";
import { Dropdown, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem, Spinner } from "reactstrap";
import classnames from "classnames";
import Swiper from "../../Swiper/Swiper";
import TableSearch from "../../Table/tableSearch";
import Checkbox from "../../Checkbox";
import { useService } from "../../../hooks/useService";
import MetaNutritionApi from "../../../../services/MetaNutritionApi";
import { CLASSIFICATION } from "../../../constants/foods";

import classes from "./BasicFoodsDropdown.module.scss";
import joinClassNames from "../../../helpers/joinClassNames";
import { useLoading } from "../../../hooks/useLoading";


const ALL_FOODS_TAB_KEY = "All";

const MIN_SEARCH_LENGTH = 3;

const BasicFoodsDropdown = ({ onChange, value = [], placeholder, withoutSelectAllOption = true }) => {
    /**
     * @type {MetaNutritionApi}
     */
    const metaNutritionService = useService(MetaNutritionApi);

    const [isOpen, updateIsOpen] = useState(false);
    const [classification, setClassification] = useState(ALL_FOODS_TAB_KEY);
    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState("");
    const [prevSearchRequest, setPrevSearchRequest] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const lastElementRef = useRef(null);
    const [isLoading, { registerPromise }] = useLoading(true);

    const hasNextPage = totalPages > page;
    const showPlaceholder = !value?.length;

    const currentFoodIds = useMemo(() => {
        return map(foods, '_id');
    }, [foods]);

    const valueIds = useMemo(() => {
        return map(value, '_id');
    }, [value]);

    const valueTitles = useMemo(() => {
        return map(value, 'foodName');
    }, [value]);

    const isSelectAllCurrentFoods = useMemo(() => {
        const diff = difference(currentFoodIds, valueIds);

        return isEmpty(diff);
    }, [currentFoodIds, valueIds]);

    const searchRequest = useMemo(() => {
            let newSearch = search && search.toString()?.trim()?.length >= MIN_SEARCH_LENGTH ? search : '';

            if (newSearch !== prevSearchRequest) {
                setFoods([]);
                setPage(1);
            }

            setPrevSearchRequest(newSearch);

            return newSearch;
        },
        [search]);


    const handleChangeClassification = (classification) => {
        setFoods([]);
        setPage(1);
        setClassification(classification);
    };

    const handleChange = (selectedItem) => {

        onChange(
            valueIds.includes(selectedItem._id)
                ? value.filter(item => item._id !== selectedItem._id)
                : [...value, selectedItem]
        );
    };

    const handleSelectAllValues = () => {
        if (!isSelectAllCurrentFoods) {
            const newFoodIds = difference(currentFoodIds, valueIds);

            const newItems = foods.filter(({ _id }) => newFoodIds.includes(_id));

            onChange([...newItems, ...value]);
        } else {
            onChange(value.filter(({ _id }) => !currentFoodIds.includes(_id)));
        }
    };

    const handleClear = () => {
        onChange([]);
    };

    useEffect(() => {
        const classificationParam = classification === ALL_FOODS_TAB_KEY
            ? undefined
            : classification;

        registerPromise(metaNutritionService.getBasicFoods({
            classification: classificationParam,
            page: page,
            q: searchRequest
        }))
            .then((({ data, meta }) => {
                setFoods((prev) => [...prev, ...data]);
                setTotalPages(meta.pages);
            }));
    }, [searchRequest, page, classification]);

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

    return (
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
                                ? placeholder || 'Select food'
                                : valueTitles.join(', ')
                        }
                            </span>
                    <i className={classnames('mdi mdi-chevron-down pointer-events-none user-select-none', { 'mdi-rotate-180': isOpen })}/>
                </DropdownToggle>
                <DropdownMenu className="filter-menu pb-1 px-1 w-100 top-50" flip={false}>
                    <TableSearch onSearch={setSearch} search={search} className="my-2"/>
                    <Swiper
                        containerClassName="my-2"
                        slidesPerView="auto"
                        spaceBetween={0}
                        slideClassName="w-fit-content"
                        slides={CLASSIFICATION.map((key) => {
                            return <button
                                type="button"
                                key={key}
                                onClick={(() => handleChangeClassification(key))}
                                className={joinClassNames(
                                    classes.Slide,
                                    key === classification ? classes.Active : ""
                                )}
                            >
                                {key}
                            </button>;
                        })}
                    />

                    <section>
                        <ListGroup>
                            <ListGroupItem
                                className={classnames("d-flex bg-transparent justify-content-between", classes.ServiceItem)}>

                                <div>
                                    {!withoutSelectAllOption && <Checkbox name="selectAllValues"
                                                                          text="Select all"
                                                                          value={isSelectAllCurrentFoods}
                                                                          onChange={handleSelectAllValues}/>
                                    }
                                </div>
                                <button type="button"
                                        className="text-danger border-0 bg-transparent"
                                        onClick={handleClear}>
                                    Clear
                                </button>
                            </ListGroupItem>

                            <div className={classnames(classes.ItemsWrapper, "custom-scrollbar")}>
                                {foods.map((item, index) => (
                                    <>
                                        <ListGroupItem className="bg-transparent border-0" key={item}>
                                            <Checkbox
                                                name="name"
                                                text={item.foodName}
                                                value={valueIds.includes(item._id)}
                                                onChange={() => handleChange(item)}
                                            />
                                            {
                                                index === foods.length - 1
                                                    ? <div
                                                        ref={lastElementRef}
                                                        className="d-flex justify-content-center">
                                                    </div>
                                                    : null
                                            }
                                        </ListGroupItem>
                                    </>
                                ))}
                            </div>
                            {isLoading && <div className="d-flex my-2 justify-content-center">
                                <Spinner size="xs" color="primary"/>
                            </div>}
                        </ListGroup>
                    </section>
                </DropdownMenu>

            </Dropdown>
        </section>
    );
};
export default BasicFoodsDropdown;
