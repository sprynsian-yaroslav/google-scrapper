import React, { useMemo } from "react";

import Button from "../../../../base/components/Button";
import TableSearch from "../../../../base/components/Table/tableSearch";
import Icon from "../../../../base/components/Icon";

import { useLocationQuery } from "../../../../base/hooks/useQueryString";
import { useHighlight } from "../../../../base/hooks/useHighlight";
import { BUTTON_COLORS } from "../../../../base/components/Button/appearance";



export const KEYWORDS_ACTIONS = {
    DELETE: 'delete',
};

export const SearchPlaceholder = () => (
    <>
        No matching keywords.
    </>
);

export const NoKeywordsPlaceholder = () => (
    <div className="text-center">
        No keywords for now.<br/>
        Click the “Create keyword” option to add a new one.
    </div>
);
export const TableHeader = ({ searchProvider, headerActions }) => {
    const handleClickCreate = () => {
        headerActions.goToCreate()
    };

    return (
        <section className="d-flex w-100 pt-1 my-3 align-items-center justify-content-between">
            <TableSearch
                className="biomarkers-search"
                search={searchProvider?.getValue()}
                onSearch={searchProvider.setValue}
                placeholder="Search keywords..."
            />


            <Button color={BUTTON_COLORS.primary} onClick={handleClickCreate} className="d-flex align-items-center">
                <i className="bx bx-plus me-2"/>
                Create keyword
            </Button>
        </section>
    );
};

export const columns = [
    {
        Header: "#",
        width: 40,
        className: "bg-white",
        Cell: (cellProps) => {
            const { params: { offset = 0 } } = useLocationQuery();
            return <label style={{width: "40px"}} className="mb-0 text-nowrap">{cellProps.row.index + 1 + (offset ?? 0)}</label>;
        }
    },
    {
        Header: "Keyword",
        accessor: "keyword",
        className: "bg-white",
        width: 200,
        Cell: ({ value }) => {
            const { params } = useLocationQuery();
            const { decorateText } = useHighlight(params.search || '');

            return (
                <section style={{width: "200px", overflow: "hidden"}}>
                    <div {...decorateText(value)} className="text-truncate mb-0"/>
                </section>
            );
        }
    },
    {
        Header: "Context Words",
        accessor: "contextWords",
        className: "bg-white",
        width: 250,
        Cell: ({ value }) => (
            <section style={{width: "250px", overflow: "hidden"}}>
                <div className="text-truncate mb-0">
                    {value && value.length ? value.join(", ") : "N/A"}
                </div>
            </section>
        )
    },
    {
        Header: "Exclude Words",
        accessor: "excludeWords",
        className: "bg-white",
        width: 250,
        Cell: ({ value }) => (
            <section style={{width: "250px", overflow: "hidden"}}>
                <div className="text-truncate mb-0">
                    {value && value.length ? value.join(", ") : "N/A"}
                </div>
            </section>
        )
    },
    {
        Header: "Site Filter",
        accessor: "siteFilter",
        className: "bg-white",
        width: 200,
        Cell: ({ value }) => (
            <section style={{width: "200px", overflow: "hidden"}}>
                <div className="text-truncate mb-0">
                    {value || "N/A"}
                </div>
            </section>
        )
    },
    {
        Header: "Search date (year)",
        accessor: "searchDate",
        className: "bg-white",
        canSort: true,
        width: 200,
        Cell: ({ value }) => (
            <section style={{width: "200px", overflow: "hidden"}}>
                <div className="text-truncate mb-0">
                    {value ? value : "N/A"}
                </div>
            </section>
        )
    },
    {
        Header: "Actions",
        className: "bg-white",
        width: 100,
        Cell: ({
                   row: {
                       original: { id }
                   },
                   actions
               }) => {

            return <section
                className="d-flex gap-1 align-items-center"
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                <Icon icon="smallTrash"
                      width={20}
                      height={20}
                      className="me-4 cursor-pointer"
                      onClick={() => actions[KEYWORDS_ACTIONS.DELETE](id)}
                />
            </section>;
        }
    }
];
