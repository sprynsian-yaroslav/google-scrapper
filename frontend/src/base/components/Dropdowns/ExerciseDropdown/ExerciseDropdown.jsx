import React, { useMemo, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem } from "reactstrap";
import classnames from "classnames";
import Swiper from "../../Swiper/Swiper";
import classes from "./ExerciseDropdown.module.scss";
import TableSearch from "../../Table/tableSearch";
import { useHighlight } from "../../../hooks/useHighlight";
import { EXERCISE_TYPES, EXERCISE_TYPES_LABEL } from "../../../../groups/app/Fitness/ExerciseForm/constants";

const ALL_TAB_KEY = "all";
const MIN_SEARCH_LENGTH = 3;

const ExerciseDropdown = ({ onChange, value, placeholder, exercises, error }) => {
    const [isOpen, updateIsOpen] = useState(false);
    const [activeTabs, setActiveTabs] = useState(ALL_TAB_KEY);
    const [search, setSearch] = useState("");

    const { decorateText } = useHighlight(search && search.length >= MIN_SEARCH_LENGTH ? search : null);

    const mappedExercises = useMemo(() => {
        const allExercisesTab = {
            exercises: exercises,
            id: 'all',
            name: 'All'
        };

        const groupedExercises = Object.values(EXERCISE_TYPES).map((type) => {
            return {
                exercises: exercises.filter((exercise) => exercise.type === type),
                id: type,
                name: EXERCISE_TYPES_LABEL[type]
            }
        })

        return [allExercisesTab, ...groupedExercises];
    }, [exercises]);

    const filterExercises = useMemo(() => {
            const lowerCaseSearchAvailableIngredients = search?.toLowerCase();

            return search && search.length >= MIN_SEARCH_LENGTH
                ? mappedExercises.map(attribute => {
                    const filteredExercises = attribute.exercises.filter((item) => item.title?.toLowerCase().includes(lowerCaseSearchAvailableIngredients));

                    return {
                        ...attribute,
                        exercises: filteredExercises
                    }
                })
                : mappedExercises;
        },
        [search, mappedExercises]);

    const slides = filterExercises.filter(item => !!item?.exercises?.length)

    const selectedExercises = useMemo(() => {
        return filterExercises.find(item => item.id === activeTabs)?.exercises;
    }, [filterExercises, activeTabs]);


    const showPlaceholder = !value;

    return (
        <section className="d-flex align-items-center w-100">
            <Dropdown
                isOpen={isOpen}
                toggle={() => updateIsOpen(prevState => !prevState)}
                className="d-inline-block filter-dropdown cursor-pointer result-filter min-w-1-5 w-100 w-100"
                direction="down"
            >
                <DropdownToggle
                    className={classnames('filter-toggle w-100', { 'with-border': isOpen, 'is-invalid': !!error })}
                    tag="section"
                >
                    <span className={
                        classnames(
                            'ms-2 me-1 pointer-events-none user-select-none text-truncate',
                            { 'text-secondary': showPlaceholder })}
                    >
                        {showPlaceholder ? placeholder : value.title}
                    </span>
                    <i className={classnames('mdi mdi-chevron-down pointer-events-none user-select-none', { 'mdi-rotate-180': isOpen })}/>
                </DropdownToggle>
                <DropdownMenu className="filter-menu pb-1 px-1 w-100 top-50" flip={false}>
                    <TableSearch onSearch={setSearch} placeholder="Search" search={search} className="my-2"/>

                    <Swiper
                        containerClassName="my-2"
                        slidesPerView="auto"
                        spaceBetween={0}
                        slideClassName="w-20"
                        slides={slides.map((item) => {
                            return <button
                                type="button"
                                key={item.id}
                                onClick={(() => setActiveTabs(item.id))}
                                className={classnames(
                                    "text-nowrap",
                                    classes.Slide,
                                    item.id === activeTabs ? classes.Active : "",
                                )}
                            >
                                {item.name}
                            </button>;
                        })}
                    />

                    <section>
                        <ListGroup>
                            <div className={classnames(classes.ItemsWrapper, "custom-scrollbar")}>
                                <div>
                                    {selectedExercises?.length
                                        ? selectedExercises.map((item) => {
                                            return (
                                                <ListGroupItem
                                                    className="bg-transparent border-0"
                                                    key={item.id}
                                                    onClick={() => {
                                                        onChange(item);
                                                        updateIsOpen(false);
                                                    }}>
                                                    <div {...decorateText(item.title)} />
                                                </ListGroupItem>
                                            );
                                        })
                                        : <div className="text-secondary py-3 w-100 text-center">No result</div>
                                    }
                                </div>
                            </div>
                        </ListGroup>
                    </section>
                </DropdownMenu>
            </Dropdown>
        </section>
    );
};
export default ExerciseDropdown;
