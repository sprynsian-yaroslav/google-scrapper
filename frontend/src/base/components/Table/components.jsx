import React, { useEffect, useState } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledTooltip } from "reactstrap";
import joinClassNames from "../../helpers/joinClassNames";

export const EllipsisWithTooltip = ({ id, fullText, divRef, children }) => {
  const [shouldShowTooltip, updateShouldShowTooltip] = useState(false);

  useEffect(() => {
    if(divRef.current.scrollWidth > divRef.current.offsetWidth) {
      updateShouldShowTooltip(true)
    }
  }, []);

  return (
    <div id={id}>
      {children}
      <UncontrolledTooltip
        popperClassName={joinClassNames(
          "tooltip-alternative-name",
          !shouldShowTooltip && "visibility-hidden"
        )}
        placement="bottom"
        target={id}
      >
        {fullText}
      </UncontrolledTooltip>
    </div>
  )
}

export const LimitDropdown = ({ options, onSelect, value }) => {
  const [isOpen, updateIsOpen] = useState(false);

  return (
    <Dropdown
      isOpen={isOpen}
      toggle={() => updateIsOpen(prevState => !prevState)}
      className="d-inline-block limit-dropdown"
    >
      <DropdownToggle
        className="btn no-outline limit-dropdown__toggle"
        id="page-limit-dropdown"
        tag="section"
      >
        <section className="pointer-events-none w-100 d-flex justify-content-between align-items-center">
          <span className="">{value}</span>
          <i className={joinClassNames("mdi mdi-chevron-down", isOpen && "mdi-rotate-180")}/>
        </section>
      </DropdownToggle>
      <DropdownMenu className="limit-dropdown--menu">
        {options.map(({ label, value: optionValue }, index) => {
          return (
            <DropdownItem
              className="px-3 d-flex align-content-center limit-dropdown--menu__option"
              key={index}
              onClick={() => {
                if(value !== optionValue){
                  onSelect(optionValue)
                }
              }}
            >
              {label}
            </DropdownItem>
          )
        })}
      </DropdownMenu>
    </Dropdown>
  )
}