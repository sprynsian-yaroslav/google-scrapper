import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, Spinner } from "reactstrap";
import classnames from "classnames";
import Checkbox from "./Checkbox";
import TableSearch from "./Table/tableSearch";

const CHECKBOXES_COUNT_FOR_CLEAR_OPTION = 1;

const FilterDropdown = ({
                            label,
                            value,
                            selectAllCheckbox,
                            listOfCheckboxes,
                            clearOption,
                            containerClassName = "",
                            showPlaceholder = true,
                            placeholder = "",
                            showClearOption = true,
                            disabled,
                            withSearch,
                            search,
                            onChangeSearch,
                            isLoading,
                            errorMessage,
                        }) => {
    const [isOpen, updateIsOpen] = useState(false);

    return (
        <section className={classnames("filter-dropdown mb-3 ", containerClassName)}>
            <label>{label}</label>

            <Dropdown
                isOpen={isOpen}
                toggle={() => updateIsOpen(prevState => !prevState)}
                className={classnames(
                    "d-inline-block",
                    disabled && "disabled-dropdown"
                )}
            >
                <DropdownToggle
                    className={classnames(
                        "filter-toggle",
                        errorMessage && "form-control is-invalid without-error-icon",
                        isOpen && "with-border")}
                    tag="section"
                >
                    <span className={classnames(
                        "ms-2 me-1 pointer-events-none user-select-none text-truncate",
                        !value && "text-secondary"
                    )}>
                        {!value ? placeholder : value}
                    </span>
                    <i className={classnames("mdi mdi-chevron-down pointer-events-none user-select-none", isOpen && "mdi-rotate-180")}/>
                </DropdownToggle>

                <DropdownMenu className="filter-menu pb-0 w-100">
                    <section className="m-2">
                    {withSearch && <TableSearch onSearch={onChangeSearch} search={search} />}

                    <div className="mt-3 d-flex justify-content-between align-items-center">
                        <Checkbox {...selectAllCheckbox} name="selectedAll" className="ms-1"/>
                        {listOfCheckboxes.length > CHECKBOXES_COUNT_FOR_CLEAR_OPTION && showClearOption &&
                            <span className="text-danger me-3 cursor-pointer" onClick={clearOption}>Clear</span>
                        }
                    </div>
                    </section>

                    <div className="dropdown-divider my-2 mt-3"/>

                    <section className="filter-options ms-2 custom-scrollbar overflow-y-scroll" style={{ maxHeight: "300px" }}>
                        {listOfCheckboxes.map((checkboxData, index) => {
                            return (
                                <Checkbox {...checkboxData} key={index} name={checkboxData.text} className="py-1 ms-1"/>
                            )
                        })}

                        {isLoading && <div className="d-flex my-2 justify-content-center">
                            <Spinner size="xs" color="primary"/>
                        </div>}
                    </section>
                </DropdownMenu>
            </Dropdown>
            <div className="invalid-feedback d-block">
                {errorMessage}
            </div>
        </section>
    );
}

export default FilterDropdown;
