import React, { useEffect, useState } from "react";
import { map, sortBy, without, difference } from "lodash";

import MultiSelectWithCheckbox from "../MultiSelectWithCheckbox";

import { useLoading } from "../../hooks/useLoading";
import { useService } from "../../hooks/useService";
import ExercisesService from "../../../services/ExercisesService";

export const MusclesDropdown = ({ value = [], name, setFieldValue, placeholder, label, errorMessage }) => {
    /**
     * @type {ExercisesService}
     */
    const exercisesService = useService(ExercisesService);
    const [isLoading, { registerPromise }] = useLoading(true);

    const [search, setSearch] = useState("");
    const [muscles, setMuscles] = useState([])

    const musclesOptions = sortBy(
        muscles.map((item) => ({index: item.id, title: item.name})),
        [item => item.title]);

    const filteredOption = search
        ? musclesOptions.filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
        : musclesOptions;

    const titleOptionById = musclesOptions.reduce((acc, item) => {
            acc[item.index] = item.title

            return acc
        }
        , {})

    const isSelectAll = !difference(map(filteredOption, "index"), value).length;

    useEffect(() => {
        registerPromise(exercisesService.getMuscles())
            .then(({data}) => {
                setMuscles(data)
            })
    }, []);

    return <div className="w-100">
        <MultiSelectWithCheckbox
            label={label}
            value={value.map(idx => titleOptionById[idx])?.join(", ")}
            selectAllCheckbox={{
                value: isSelectAll,
                text: "Select all",
                onChange: () => setFieldValue(
                    name,
                    isSelectAll
                        ? []
                        : map(filteredOption, "index")
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
            isLoading={isLoading}
            errorMessage={errorMessage}
        />
    </div>;
};