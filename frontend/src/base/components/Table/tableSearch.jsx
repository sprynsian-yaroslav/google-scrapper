import React from 'react'
import PropTypes from "prop-types";
import CustomInput from "../Input";
import joinClassNames from "../../helpers/joinClassNames";

export const cyrillicPattern = /[\u0400-\u04FF]/gi;

export const formatSearch = (searchValue = "") => {
  return searchValue.replaceAll(cyrillicPattern, "")
}

export default function TableSearch({ search = "", onSearch, className, placeholder = "Search...", autoFocus }) {
  return (
    <section className={joinClassNames("table-search__search", className)}>
      <CustomInput
        value={search}
        handleChange={(e) => onSearch(formatSearch(e.target.value))}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      <i className="bx bx-search-alt search-icon"/>
      {search &&
        <i className="bx bx-x reset-icon" onClick={() => onSearch("")}/>
      }
    </section>
  );
}

TableSearch.propTypes = {
  toolkitProps: PropTypes.object,
}