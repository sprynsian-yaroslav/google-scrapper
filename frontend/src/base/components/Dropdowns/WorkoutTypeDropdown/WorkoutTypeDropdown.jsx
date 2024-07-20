// Libs
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem, Spinner } from "reactstrap";
import { debounce } from "lodash";
import classnames from "classnames";

// Components, Views, Screens


// Hooks, Utils, Helpers
import { useService } from "../../../hooks/useService";
import { useLoading } from "../../../hooks/useLoading";
import WorkoutService from "../../../../services/WorkoutService";


// Styles, assets
import classes from "./WorkoutTypeDropdown.module.scss";

const DEFAULT_LIMIT = 15;


export const WorkoutTypeDropdown = ({ onChange, value, placeholder, label, error, handleBlur }) => {
    /**
     * @type {WorkoutService}
     */
    const workoutService = useService(WorkoutService);

    const [isOpen, updateIsOpen] = useState(false);
    const [workoutTypes, setWorkoutTypes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, { registerPromise }] = useLoading(true);
    const lastElementRef = useRef(null);

    const showPlaceholder = !value?.id;

    const mapWorkoutTypesToDropdown = (data = []) => {
        return data.map((item) => ({ id: item.id, name: item.name }));
    };

    const setNextPage = () => {
        if (isLoading || !hasNextPage) return;
        setPage(page + 1);
    };

    const debounceSetNextPage = debounce(setNextPage, 300);

    const loadWorkoutType = useCallback(() => {

        const nextOffset = (page - 1) * DEFAULT_LIMIT;

        const params = { limit: DEFAULT_LIMIT, offset: nextOffset };

        registerPromise(workoutService.getWorkoutTypes(params))
            .then((result => {
                setWorkoutTypes([...workoutTypes, ...mapWorkoutTypesToDropdown(result.data)]);
                setHasNextPage(result?.pagination?.nextOffset < result?.pagination?.totalCount);
            }));
    }, [page]);

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
        loadWorkoutType();
    }, [page]);

    return (<>
            {!!label && <label>{label}</label>}
            <section className="d-flex align-items-center w-100">
                <Dropdown
                    isOpen={isOpen}
                    toggle={() => {
                        if (isOpen) {
                            handleBlur();
                        }
                        updateIsOpen(prevState => !prevState);
                    }}
                    className="d-inline-block filter-dropdown cursor-pointer result-filter w-100"
                    direction="down"
                >
                    <DropdownToggle
                        className={classnames('filter-toggle max-w-100 pe-0',
                            {
                                'with-border': isOpen,
                                'is-invalid': !!error
                            }
                        )}
                        tag="section"
                    >
                <span
                    className={classnames('ms-2 me-1 pointer-events-none user-select-none text-truncate', { 'text-secondary': showPlaceholder })}>
            {
                showPlaceholder
                    ? placeholder || 'Select workout type'
                    : value?.name
            }
                </span>
                        <i className={classnames('mdi mdi-chevron-down pointer-events-none user-select-none me-2', { 'mdi-rotate-180': isOpen })}/>
                    </DropdownToggle>

                    <DropdownMenu className="filter-menu pb-1 px-1 w-100 top-50" flip={false}>
                        <section>
                            <ListGroup>
                                <div className={classnames(classes.ItemsWrapper, "custom-scrollbar")}>
                                    {workoutTypes.map((item, index) => (
                                        <ListGroupItem className="bg-transparent border-0 p-0" key={item.id}>
                                            <div
                                                className={classnames(classes.Item, value?.id === item.id && classes.Active)}
                                                onClick={() => onChange(item)}
                                            >
                                                {item.name}
                                            </div>
                                            {
                                                index === workoutTypes.length - 1
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
    )
        ;
};

