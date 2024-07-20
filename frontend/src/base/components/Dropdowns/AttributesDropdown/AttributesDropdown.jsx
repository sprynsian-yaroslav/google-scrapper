import React, { useMemo, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem } from "reactstrap";
import classnames from "classnames";
import Swiper from "../../Swiper/Swiper";
import classes from "./AttributesDropdown.module.scss";
import TableSearch from "../../Table/tableSearch";
import { useHighlight } from "../../../hooks/useHighlight";

const ALL_TAB_KEY = "all";
const MIN_SEARCH_LENGTH = 3;

const AttributesDropdown = ({ onChange, value, placeholder, attributes, error }) => {
    const [isOpen, updateIsOpen] = useState(false);
    const [activeTabs, setActiveTabs] = useState(ALL_TAB_KEY);
    const [search, setSearch] = useState("");

    const allAttributes = attributes.reduce((acc, item) => {
        return [...acc, ...item.attributes];
    }, []);

    const { decorateText } = useHighlight(search && search.length >= MIN_SEARCH_LENGTH ? search : null);

    const mappedAttributes = useMemo(() => {
        const allAttributesTab = {
            attributes: allAttributes,
            id: 'all',
            name: 'All'
        };

        return [allAttributesTab, ...attributes];
    }, [attributes, allAttributes]);

    const filterAttributes = useMemo(() => {
            const lowerCaseSearchAvailableIngredients = search?.toLowerCase();

            return search && search.length >= MIN_SEARCH_LENGTH
                ? mappedAttributes.map(attribute => {
                    const filteredAttributes = attribute.attributes.filter((item) => item.name?.toLowerCase().includes(lowerCaseSearchAvailableIngredients));

                    return {
                        ...attribute,
                        attributes: filteredAttributes
                    }
                })
                : mappedAttributes;
        },
        [search, mappedAttributes]);

    const slides = filterAttributes.filter(item => !!item?.attributes?.length)

    const selectedAttributes = useMemo(() => {
        return filterAttributes.find(item => item.id === activeTabs)?.attributes;
    }, [filterAttributes, activeTabs]);


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
                        {showPlaceholder ? placeholder : value}
                    </span>
                    <i className={classnames('mdi mdi-chevron-down pointer-events-none user-select-none', { 'mdi-rotate-180': isOpen })}/>
                </DropdownToggle>
                <DropdownMenu className="filter-menu pb-1 px-1 w-100 top-50" flip={false}>
                    <TableSearch onSearch={setSearch} placeholder="Search" search={search} className="my-2"/>

                    <Swiper
                        containerClassName="my-2"
                        slidesPerView="auto"
                        spaceBetween={0}
                        slideClassName="w-fit-content"
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
                                    {selectedAttributes?.length
                                        ? selectedAttributes.map((item) => {
                                            return (
                                                <ListGroupItem
                                                    className="bg-transparent border-0"
                                                    key={item.id}
                                                    onClick={() => {
                                                        onChange(item);
                                                        updateIsOpen(false);
                                                    }}>
                                                    <div {...decorateText(item.name)} />
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
export default AttributesDropdown;
