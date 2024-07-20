import React, { useState } from "react";
import { map, sortBy, without } from "lodash";

import MultiSelectWithCheckbox from "../MultiSelectWithCheckbox";

import { ALLERGEN_TITLES } from "../../constants/foods";

export const AllergensDropdown = ({ value = [], name, setFieldValue, placeholder, label }) => {
    const [search, setSearch] = useState("");

    const allergensOptions = sortBy(
        Object.entries(ALLERGEN_TITLES).map(([index, title]) => ({ title, index })),
        [item => item.title]);

    const filteredOption = search
        ? allergensOptions.filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
        : allergensOptions;

    const isSelectAll = value?.length === Object.keys(allergensOptions).length;

    return <MultiSelectWithCheckbox
        label={label}
        value={value.map(idx => ALLERGEN_TITLES[idx])?.join(", ")}
        selectAllCheckbox={{
            value: isSelectAll,
            text: "Select all",
            onChange: () => setFieldValue(
                name,
                isSelectAll
                    ? []
                    : map(allergensOptions, "index")
            )
        }}
        listOfCheckboxes={filteredOption.map(({ title, index }) => {
            const valueItem = value?.includes(index);

            return {
                value: valueItem,
                text: title,
                onChange: () => {
                    const newAllergens = valueItem ? without(value, index) : [...value, index];
                    setFieldValue(name, newAllergens);
                }
            };
        })}
        placeholder={placeholder}
        clearOption={() => setFieldValue(name, [])}
        withSearch
        search={search}
        onChangeSearch={setSearch}
    />;
};