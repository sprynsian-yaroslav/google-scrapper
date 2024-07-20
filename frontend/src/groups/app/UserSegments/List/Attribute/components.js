import TableSearch from "../../../../../base/components/Table/tableSearch";
import React, { useMemo } from "react";
import Button from "../../../../../base/components/Button";
import { useLocationQuery } from "../../../../../base/hooks/useQueryString";
import { BUTTON_COLORS } from "../../../../../base/components/Button/appearance";
import { useHighlight } from "../../../../../base/hooks/useHighlight";
import Icon from "../../../../../base/components/Icon";
import { ATTRIBUTE_TYPE_LABELS } from "../../constants";
import { MIN_SEARCH_LENGTH } from "../constants";


export const ATTRIBUTE_ACTIONS = {
    DELETE: 'delete',
    EDIT: 'edit'
};

export const SearchPlaceholder = () => (
    <>
        No matching attributes
    </>
);

export const NoAttributePlaceholder = () => (
    <div className="text-center">
        No attributes for now.<br/>
        Click the “Create attribute” option to add a new one.
    </div>
);
export const TableHeader = ({ searchProvider, headerActions }) => {

    return (
        <section className="d-flex w-100 pt-1 my-3 align-items-center justify-content-between">
            <TableSearch
                className="biomarkers-search"
                search={searchProvider?.getValue()}
                onSearch={searchProvider.setValue}
                placeholder="Search attributes..."
            />


            <Button color={BUTTON_COLORS.primary} onClick={headerActions.goToCreate}
                    className="d-flex align-items-center">
                <i className="bx bx-plus me-2"/>
                Create attribute
            </Button>
        </section>
    );
};

export const columns = [
    {
        Header: "#",
        width: 40,
        minWidth: 40,
        className: "bg-white",
        Cell: (cellProps) => {
            const { params: { offset = 0 } } = useLocationQuery();
            return <label style={{width: "40px"}} className="mb-0 text-nowrap">{cellProps.row.index + 1 + (offset ?? 0)}</label>;
        }
    },
    {
        Header: "Label",
        accessor: "label",
        className: "bg-white",
        width: 180,
        canSort: true,
        Cell: ({ value }) => {

            const { params } = useLocationQuery();

            const searchRequest = useMemo(() => params.search && params.search.toString()?.trim()?.length >= MIN_SEARCH_LENGTH
                    ? params.search
                    : null,
                [params.search]);

            const { decorateText } = useHighlight(searchRequest);

            return (
                <section style={{ width: "180px", overflow: "hidden" }}>
                    <div {...decorateText(value)} className="text-truncate mb-0"/>
                </section>
            );
        }
    },
    {
        Header: "Name",
        accessor: "name",
        className: "bg-white",
        width: 280,
        Cell: ({ value }) => {
            const { params } = useLocationQuery();

            const searchRequest = useMemo(() => params.search && params.search.toString()?.trim()?.length >= MIN_SEARCH_LENGTH
                    ? params.search
                    : null,
                [params.search]);

            const { decorateText } = useHighlight(searchRequest);

            return (
                <section style={{ width: "280px", overflow: "hidden" }}>
                    <div {...decorateText(value)} className="text-truncate mb-0"/>
                </section>
            );
        }
    },
    {
        Header: "Category",
        accessor: "attributeCategory",
        className: "bg-white",
        width: 160,
        canSort: true,
        Cell: ({ value }) => {
            return (
                <section style={{ width: "160px", overflow: "hidden" }}>
                    <div>{value?.name}</div>
                </section>
            );
        }
    },
    {
        Header: "Value type",
        accessor: "type",
        className: "bg-white",
        width: 160,
        Cell: ({ value }) => {
            return (
                <section style={{ width: "140px", overflow: "hidden" }}>
                    <div>{ATTRIBUTE_TYPE_LABELS[value]}</div>
                </section>
            );
        }
    },
    {
        Header: "Quiz variable name",
        accessor: "quizVariableName",
        className: "bg-white",
        width: 220,
        Cell: ({ value }) => {

            return (
                <section style={{ width: "220px", overflow: "hidden" }}>
                    <div className="text-truncate mb-0"> {value}</div>
                </section>
            );
        }
    },
    {
        Header: "Actions",
        accessor: "isSystem",
        className: "bg-white",
        Cell: ({
                   value,
                   row: {
                       original: { id }
                   },
                   actions
               }) => {
            if (value) {
                return (
                    <section className="attribute__na-icon">N/A</section>
                );
            }

            return <section
                className="d-flex gap-1 align-items-center"
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                <Icon
                    icon="edit"
                    width={20}
                    height={20}
                    className="me-4 cursor-pointer"
                    onClick={() => actions[ATTRIBUTE_ACTIONS.EDIT](id)}
                />
                <Icon icon="smallTrash"
                      width={20}
                      height={20}
                      className="me-4 cursor-pointer"
                      onClick={() => actions[ATTRIBUTE_ACTIONS.DELETE](id)}
                />
            </section>;
        }
    }
];