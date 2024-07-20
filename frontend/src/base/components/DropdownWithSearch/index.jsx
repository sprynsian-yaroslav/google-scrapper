import React, { useState } from 'react'
import joinClassNames from "../../helpers/joinClassNames";
import { Dropdown, DropdownMenu, DropdownToggle, Spinner } from "reactstrap";
import CustomInput from "../Input";
import { formatSearch } from "../Table/tableSearch";
import { useHighlight } from "../../hooks/useHighlight";
import Icon from "../Icon";

export default function DropdownWithSearch({
  containerClassName = "",
  labelClassName = "",
  label,
  items = [],
  value = {},
  search = "",
  isLoading,
  onSearch,
  onSelect,
  placeholder,
  onDelete,
  onFavourite,
  ignoreClassNames
}){
  const [isOpen, updateIsOpen] = useState(false);
  const { decorateText } = useHighlight(search);

  const _containerClassName = ignoreClassNames ? containerClassName : joinClassNames("d-flex align-items-center", containerClassName)
  const _labelClassName = ignoreClassNames ? labelClassName : joinClassNames("mb-0", labelClassName)
  return (
    <section className={_containerClassName}>
      <label className={_labelClassName}>{label}</label>
      <Dropdown
        isOpen={isOpen}
        toggle={() => updateIsOpen(prevState => !prevState)}
        className="d-inline-block filter-dropdown cursor-pointer result-filter-responsible"
      >
        <DropdownToggle
          className={joinClassNames("filter-toggle", isOpen && "with-border")}
          tag="section"
        >
          <CustomInput
            value={value.name ?? value.label ?? search}
            placeholder={placeholder}
            className="no-border no-outline "
            onChange={event => onSearch(formatSearch(event.target.value))}
          />
          <i
            className={joinClassNames(
              "mdi mdi-chevron-down pointer-events-none user-select-none",
              isOpen && "mdi-rotate-180"
            )}
          />
        </DropdownToggle>
        <DropdownMenu className={joinClassNames(
          "filter-menu w-100 templates-list py-2 custom-scrollbar",
          (isLoading || !items.length) && isOpen && "d-flex align-items-center justify-content-center cursor-default",
        )}>
          {isLoading &&
            <Spinner color="info"/>
          }
          {!isLoading && !items.length &&
            <label className="mb-0 text-secondary">No matches found</label>
          }
          {!isLoading && items.map(({ name, id, isFavourite, ...rest }) => {
            const selected = value.id === id;

            return (
              <section
                className={joinClassNames(
                  "d-flex align-items-center justify-content-between templates-list__item",
                )}
                key={id}
                onClick={() => {
                  if(!selected){
                    onSelect({ name, id, isFavourite, ...rest })
                  }
                  updateIsOpen(false)
                }}
              >
                <div className="text-truncate templates-list__item__text" {...decorateText(name)}/>
                <section className="d-flex align-items-center">
                  <Icon
                    icon={isFavourite ? "favourite" : "notFavourite"}
                    className="me-2"
                    onClick={(event) => {
                      event.stopPropagation();
                      onFavourite(id, isFavourite)
                    }}
                  />
                  <Icon
                    icon="smallTrash"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(id);
                    }}
                  />
                </section>
              </section>
            )
          })}

        </DropdownMenu>
      </Dropdown>
    </section>
  )
}