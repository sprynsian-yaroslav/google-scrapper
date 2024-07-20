import React, {useEffect, useMemo, useState} from "react";
import {difference, flatten, isEmpty, keyBy, map, sortBy} from "lodash";
import {Dropdown, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem} from "reactstrap";
import classnames from "classnames";
import Swiper from "../../Swiper/Swiper";
import classes from "./FoodIntoleranceDeopdown.module.scss"
import TableSearch from "../../Table/tableSearch";
import Checkbox from "../../Checkbox";
import { useService } from "../../../hooks/useService";
import ProgramsService from "../../../../services/ProgramsService";

const ALL_FOODS_TAB_KEY = "all"

const FoodIntoleranceDropdown= ({onChange, value = [], placeholder}) => {
    const [isOpen, updateIsOpen] = useState(false);
    const [foodGroups, setFoodGroups] = useState([]);
    const [activeTabs, setActiveTabs] = useState(ALL_FOODS_TAB_KEY);
    const [search, setSearch] = useState("");
    /**
     * @type {ProgramsService}
     */
    const programsService = useService(ProgramsService)

    const valueIds = map(value, '_id')

    const showPlaceholder = !value?.length;

    useEffect(() => {
        programsService.getFoods()
            .then((result => {
                setFoodGroups(result)
            }))
    }, []);

    const allFoods = useMemo(() => {
        return flatten(map(foodGroups, 'foods'));
    }, [foodGroups])

    const allFoodsGroupById = useMemo(() => {
        return keyBy(allFoods, "id")
    }, [allFoods])

    const foodGroupWithAllFood = [
        {
            foodGroupId: ALL_FOODS_TAB_KEY,
            foodGroupName: "All",
            foods: allFoods
        },
        ...foodGroups
    ]

    const foodGroupById = keyBy(foodGroupWithAllFood, "foodGroupId")

    const filteredCurrentFood = useMemo(() => {
            const lowerCaseSearchAvailableIngredients = search.toLowerCase();

            return search
                ? foodGroupById[activeTabs].foods.filter((item) => item.name.toLowerCase().includes(lowerCaseSearchAvailableIngredients))
                : foodGroupById[activeTabs].foods
        },
        [search, foodGroupById, activeTabs]
    )

    const currentFoodIds = map(filteredCurrentFood, "id")

    const isSelectAllCurrentFoods = useMemo(() => {
        const diff = difference(currentFoodIds, valueIds)

        return isEmpty(diff)
    }, [currentFoodIds, valueIds])

    const slides = sortBy(Object.keys(foodGroupById), (item) => item !== ALL_FOODS_TAB_KEY);

    const handleChange = (id) => {
        const _id = id
        const name = allFoodsGroupById?.[id]?.name
        const foodGroupId = allFoodsGroupById?.[id]?.foodGroupId
        const foodGroup = foodGroupById[foodGroupId]?.foodGroupName

        onChange(
            valueIds.includes(id)
                ? value.filter(item => item._id !== id)
                : [...value, {_id, name, foodGroup}]
        )
    }

    const handleSelectAllValues = () => {
        if (!isSelectAllCurrentFoods) {
            const newFoodIds = difference(currentFoodIds, valueIds)

            const newItems = newFoodIds.map((id) =>  {
                const _id = id
                const name = allFoodsGroupById?.[id]?.name
                const foodGroupId = allFoodsGroupById?.[id]?.foodGroupId
                const foodGroup = foodGroupById[foodGroupId]?.foodGroupName

                return {_id, name, foodGroup}
            })

            onChange([...newItems, ...value])
        } else {
            onChange(value.filter(({_id}) => !currentFoodIds.includes(_id)))
        }
    }

    const handleClear = () => {
        onChange([])
    }

    return (
        <section className="d-flex align-items-center w-100">
            <Dropdown
                isOpen={isOpen}
                toggle={() => updateIsOpen(prevState => !prevState)}
                className="d-inline-block filter-dropdown cursor-pointer result-filter w-100"
                direction="down"
            >
                <DropdownToggle
                    className={classnames('filter-toggle w-100', {'with-border': isOpen})}
                    tag="section"
                >
                    <span
                        className={classnames('ms-2 me-1 pointer-events-none user-select-none text-truncate', {'text-secondary': showPlaceholder})}>
                        {
                            showPlaceholder
                                ? placeholder || 'Select food intolerance'
                                : valueIds.reduce((prevValue, currValue) => {
                                    return prevValue + (prevValue && allFoodsGroupById?.[currValue]?.name ? ', ' : '') + (allFoodsGroupById?.[currValue]?.name || '')
                                }, '')
                        }
                            </span>
                    <i className={classnames('mdi mdi-chevron-down pointer-events-none user-select-none', {'mdi-rotate-180': isOpen})}/>
                </DropdownToggle>
                <DropdownMenu className="filter-menu pb-1 px-1 w-100 top-50" flip={false}>
                    <TableSearch onSearch={setSearch} search={search} className="my-2"/>
                    <Swiper
                        containerClassName="my-2"
                        slidesPerView="auto"
                        spaceBetween={0}
                        slideClassName="w-fit-content"
                        slides={slides.map((key) => {
                            return <button
                                type="button"
                                key={key}
                                onClick={(() => setActiveTabs(key))}
                                className={classnames(
                                    classes.Slide,
                                    key === activeTabs ? classes.Active : ""
                                )}
                            >
                                {foodGroupById[key]?.foodGroupName}
                            </button>
                        })}
                    />

                    <section>
                        <ListGroup>
                            <ListGroupItem
                                className={classnames("d-flex bg-transparent justify-content-between", classes.ServiceItem)}>
                                <Checkbox name="selectAllValues"
                                          text="Select all"
                                          value={isSelectAllCurrentFoods}
                                          onChange={handleSelectAllValues}/>
                                <button type="button"
                                        className="text-danger border-0 bg-transparent"
                                        onClick={handleClear}>
                                    Clear
                                </button>
                            </ListGroupItem>

                            <div className={classnames(classes.ItemsWrapper, "custom-scrollbar")}>
                                {currentFoodIds.map((item) => (
                                    <ListGroupItem className="bg-transparent border-0" key={item}>
                                        <Checkbox
                                            name="name"
                                            text={allFoodsGroupById[item].name}
                                            value={valueIds.includes(item)}
                                            onChange={() => handleChange(item)}
                                        />
                                    </ListGroupItem>
                                ))}
                            </div>
                        </ListGroup>
                    </section>
                </DropdownMenu>

            </Dropdown>
        </section>
    )
};
export default FoodIntoleranceDropdown;
