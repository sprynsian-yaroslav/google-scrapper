import React from "react";

import TableSearch from "../../../../../../base/components/Table/tableSearch";

import { useLocationQuery } from "../../../../../../base/hooks/useQueryString";
import { useHighlight } from "../../../../../../base/hooks/useHighlight";

export const SearchPlaceholder = () => (
    <>
        No matching scraping results.
    </>
);

export const NoScrapingResultsPlaceholder = () => (
    <div className="text-center">
        No scraping results for now.<br/>
        Click the “Start scraping” option to add a new.
    </div>
);
export const TableHeader = ({ searchProvider }) => {

    return (
        <section className="d-flex w-100 pt-1 my-3 align-items-center justify-content-between">
            <TableSearch
                className="biomarkers-search"
                search={searchProvider?.getValue()}
                onSearch={searchProvider.setValue}
                placeholder="Search scraping results..."
            />
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
        Header: "Link",
        accessor: "link",
        className: "bg-white",
        canSort: true,
        width: 400,
        Cell: ({ value }) => {
            const { params } = useLocationQuery();
            const { decorateText } = useHighlight(params.search || '');

            return (
                <section style={{width: "400px", overflow: "hidden"}}>
                    <div {...decorateText(value)} className="text-truncate mb-0"/>
                </section>
            );
        }
    },
    {
        Header: "Text",
        accessor: "text",
        className: "bg-white",
        canSort: true,
        width: 400,
        Cell: ({ value }) => {
            const { params } = useLocationQuery();
            const { decorateText } = useHighlight(params.search || '');

            return (
                <section style={{width: "400px", overflow: "hidden"}}>
                    <div {...decorateText(value)} className="text-truncate mb-0"/>
                </section>
            );
        }
    },
    {
        Header: "Created at",
        accessor: "createdAt",
        className: "bg-white",
        canSort: true,
        width: 400,
        Cell: ({ value }) => {
            const { params } = useLocationQuery();
            const { decorateText } = useHighlight(params.search || '');

            return (
                <section style={{width: "400px", overflow: "hidden"}}>
                    <div {...decorateText(value)} className="text-truncate mb-0"/>
                </section>
            );
        }
    },
];