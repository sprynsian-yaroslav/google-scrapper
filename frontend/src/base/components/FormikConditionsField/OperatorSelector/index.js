import React, { useState } from 'react';
import { OPERATION_TITLES, OPERATIONS_BY_TYPES, OPERATION_ICONS } from "./constants";
import Icon from "../../Icon";
import { Dropdown, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem, UncontrolledTooltip } from "reactstrap";
import classnames from "classnames";

import classes from "./OperatorSelector.module.scss";

const OperatorSelector = ({ value, type, setFieldValue, index, error }) => {

    const [isOpen, updateIsOpen] = useState(false);

    const options = (type ? OPERATIONS_BY_TYPES[type] : []).map((operation, index) => {
        return {
            id: operation,
            value: operation,
            label: <OperatorItem operator={operation} index={index} />
        };
    });

    return (
        <section className="d-flex align-items-center w-100">
            <Dropdown
                isOpen={isOpen}
                toggle={() => updateIsOpen(prevState => !prevState)}
                className={classnames("d-inline-block cursor-pointer w-100", classes.OperatorDropdown)}
                direction="down"
            >
                <DropdownToggle
                    className={classnames(classes.FilterToggle, 'w-100', { 'with-border': isOpen, [classes.isInvalid]: !!error })}
                    tag="section"
                    id={`operator-value-${index}`}
                >
                    <span className="ms-2 me-1 w-100 pointer-events-none user-select-none text-truncate">
                        <OperatorItem operator={value} />
                    </span>
                    <i className={classnames('mdi mdi-chevron-down pointer-events-none user-select-none', { 'mdi-rotate-180': isOpen })}/>
                </DropdownToggle>

                {value && <UncontrolledTooltip target={`operator-value-${index}`} placement="top">
                    {OPERATION_TITLES[value]}
                </UncontrolledTooltip>}

                <DropdownMenu className={classnames(classes.DropdownMenu, "pb-1 px-1 w-100 top-50")} flip={false}>
                    <section>
                        <ListGroup className={classnames(classes.ListGroup)}>
                            <div className={classnames(classes.ItemsWrapper, "custom-scrollbar")}>
                                <div>
                                    {options.map((item) => (
                                        <ListGroupItem
                                            className="bg-transparent border-0"
                                            key={item.id}
                                            onClick={() => {
                                                setFieldValue(item.value);
                                            }}>
                                            {item.label}
                                        </ListGroupItem>
                                    ))}
                                </div>
                            </div>
                        </ListGroup>
                    </section>
                </DropdownMenu>
            </Dropdown>
        </section>
    );
};

export default OperatorSelector;

function OperatorItem({index, operator}) {
    if (!OPERATION_ICONS[operator]) return

    return <>
        <div id={`operator${index}`}>
            <Icon icon={OPERATION_ICONS[operator]}/>
        </div>
        {(index || index === 0) && <UncontrolledTooltip target={`operator${index}`} placement="bottom">
            {OPERATION_TITLES[operator]}
        </UncontrolledTooltip>}
    </>
}
