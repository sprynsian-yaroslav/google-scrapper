import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../../../base/components/Button";
import TableSearch from "../../../../../base/components/Table/tableSearch";
import Icon from "../../../../../base/components/Icon";

import { useLocationQuery } from "../../../../../base/hooks/useQueryString";
import { useHighlight } from "../../../../../base/hooks/useHighlight";
import { BUTTON_COLORS } from "../../../../../base/components/Button/appearance";
import { USER_SEGMENTS_GROUP_LINKS } from "../../config";
import { MIN_SEARCH_LENGTH } from "../constants";

export const USER_SEGMENTS_ACTIONS = {
    DELETE: 'delete',
    EDIT: 'edit',
    COPY: 'copy'
};

export const SearchPlaceholder = () => (
    <>
        No matching user segments.
    </>
);

export const NoUserSegmentsPlaceholder = () => (
    <div className="text-center">
        No user segments for now.<br/>
        Click the “Create user segment” option to add a new one.
    </div>
);
export const TableHeader = ({ searchProvider }) => {
    const navigate = useNavigate();
    const goToCreate = () => {
        navigate(USER_SEGMENTS_GROUP_LINKS.CREATE_EDIT_SEGMENTS);
    };

    return (
        <section className="d-flex w-100 pt-1 my-3 align-items-center justify-content-between">
            <TableSearch
                className="biomarkers-search"
                search={searchProvider?.getValue()}
                onSearch={searchProvider.setValue}
                placeholder="Search user segments..."
            />


            <Button color={BUTTON_COLORS.primary} onClick={goToCreate} className="d-flex align-items-center">
                <i className="bx bx-plus me-2"/>
                Create user segment
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
        Header: "Name",
        accessor: "fullName",
        className: "bg-white",
        canSort: true,
        width: 400,
        Cell: ({ value }) => {
            const { params } = useLocationQuery();
            const searchRequest = useMemo(() => params.search && params.search.toString()?.trim()?.length >= MIN_SEARCH_LENGTH ? params.search : null, [params.search])
            const { decorateText } = useHighlight(searchRequest);

            return (
                <section style={{width: "400px", overflow: "hidden"}}>
                    <div {...decorateText(value)} className="text-truncate mb-0"/>
                </section>
            );
        }
    },
    {
        Header: "Priority",
        accessor: "priority",
        className: "bg-white",
        width: 70,
        canSort: true,
        Cell: ({ value }) => {
            return (
                <section>
                    <div>{value}</div>
                </section>
            )
        }
    },
    {
        Header: "Attribute used",
        accessor: "attributes",
        className: "bg-white",
        width: 300,
        Cell: ({ value }) => {
            return (
                <section style={{width: "300px", overflow: "hidden"}}>
                    <div>{value?.toString()}</div>
                </section>
            );
        }
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
                <Icon
                    icon="copy"
                    width={20}
                    height={20}
                    className="me-4 cursor-pointer"
                    onClick={() => actions[USER_SEGMENTS_ACTIONS.COPY](id)}
                />
                <Icon
                    icon="edit"
                    width={20}
                    height={20}
                    className="me-4 cursor-pointer"
                    onClick={() => actions[USER_SEGMENTS_ACTIONS.EDIT](id)}
                />
                <Icon icon="smallTrash"
                      width={20}
                      height={20}
                      className="me-4 cursor-pointer"
                      onClick={() => actions[USER_SEGMENTS_ACTIONS.DELETE](id)}
                />
            </section>;
        }
    }
];