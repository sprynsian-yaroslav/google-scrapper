import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Table as ReactstrapTable, Spinner } from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useTable, usePagination, useFlexLayout } from 'react-table';
import Pagination from "../Pagination";
import Icon from "../Icon";
import joinClassNames from "../../helpers/joinClassNames";
import { DEFAULT_TABLE_LIMIT } from "../../constants/shared";
import { LimitDropdown } from "./components";

const ASC_SORT = 'asc';
const DESC_SORT = 'desc';

export const sortColumn = (columnId, sortProviders, order) => {
    if (!sortProviders?.[columnId]) return;
    const currentSortProvider = sortProviders[columnId];
    const currentSortValue = currentSortProvider.getValue();

    if (!currentSortValue) {
        currentSortProvider.setValue(order);
        return;
    }
    currentSortProvider.setValue(currentSortValue === ASC_SORT ? DESC_SORT : ASC_SORT);
};

export const getSortIcon = (columnId, sortProviders, rows, loading) => {
    const onClickArrow = (e) => {
        const order = e.currentTarget.className.baseVal.includes("asc-arrow")
            ? ASC_SORT
            : DESC_SORT;

        if (!rows.length || loading) return;
        sortColumn(columnId, sortProviders, order);
    };

    const currentSortProvider = sortProviders?.[columnId];
    const currentSortValue = currentSortProvider?.getValue();
    if (currentSortValue) {
        return (
            <>
                <Icon
                    onClick={onClickArrow}
                    icon="sortDesc"
                    style={{ height: "18px" }}
                    className={joinClassNames(
                        "asc-arrow ms-1",
                        currentSortValue === ASC_SORT && "active-sort-icon"
                    )}
                />
                <Icon
                    onClick={onClickArrow}
                    icon="sortAsc"
                    style={{ height: "18px" }}
                    className={joinClassNames(
                        "desc-arrow",
                        currentSortValue === DESC_SORT && "active-sort-icon"
                    )}
                />
            </>
        );
    }
    return (
        <>
            <Icon onClick={onClickArrow} icon="sortDesc" className="ms-1 asc-arrow" style={{ height: "18px" }}/>
            <Icon onClick={onClickArrow} icon="sortAsc" className="desc-arrow" style={{ height: "18px" }}/>
        </>
    );
};

export default function Table({
                                  isAddNewBiomarker,
                                  handleUserClick,
                                  className,
                                  loading = false,
                                  columns = [],
                                  data = [],
                                  HeaderComponent,
                                  handleTableChange = () => {
                                  },
                                  totalCount = 0,
                                  limit = DEFAULT_TABLE_LIMIT,
                                  offset = 0,
                                  isRowClick = false,
                                  rowClickPath,
                                  searchField = "",
                                  withLocation = true,
                                  sortProviders,
                                  paginationProvider = () => {
                                  },
                                  actions,
                                  onDelete,
                                  onEdit,
                                  onActivateItem,
                                  onArchive,
                                  searchProvider,
                                  filterProvider,
                                  dateRangeProviders,
                                  commonPlaceholder,
                                  placeholderForSearch,
                                  placeholderForSearchClassName,
                                  useCollapseRule = () => {
                                  },
                                  toggleCollapse,
                                  collapsedState,
                                  CollapsedComponent,
                                  hasActiveFilters = filterProvider?.getValue(),
                                  isLimitEditable,
                                  limitProvider,
                                  limitOptions = [],
                                  headerClassName,
                                  withoutPagination,
                                  tableClassName,
                                  ...props
                              }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleRowClick = (id) => {
        if (!id || !isRowClick) return;
        const path = (withLocation ? location.pathname : "") + (rowClickPath ? rowClickPath + `/${id}` : `/${id}`);
        navigate(path);
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { pageIndex, pageSize },
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize
    } = useTable({
        columns, data, initialState: { pageIndex: offset / limit },
        manualPagination: true,
        manualSortBy: true,
        onDeleteItem: onDelete,
        onEditItem: onEdit,
        onActivateItem,
        onArchive,
        actions,
        collapsedState,
        useCollapseRule,
        toggleCollapse,
        pageCount: Math.ceil(totalCount / limit)
    }, usePagination, useFlexLayout);

    useEffect(() => {
        if (paginationProvider.setValue) {
            paginationProvider.setValue(pageIndex * limit);
        }
    }, [pageIndex]);

    useEffect(() => {
        gotoPage(offset / limit);
    }, [offset]);

    useEffect(() => {
        if (!rows.length && canPreviousPage && !loading) {
            previousPage();
        }
    }, [rows.length, canPreviousPage, loading]);

    const tableRef = useRef();

    useEffect(() => {
        if (rows.length) return;
        tableRef.current?.scrollTo(0, 0);
    }, [rows.length]);

    return (
        <>
            {HeaderComponent && <HeaderComponent
                {...props}
                searchProvider={searchProvider}
                filterProvider={filterProvider}
                sortProviders={sortProviders}
                dateRangeProviders={dateRangeProviders}
            />}

            <div
                ref={tableRef}
                className={joinClassNames(
                    "table-responsive react-table custom-horizontal-scrollbar",
                    tableClassName,
                    loading && "overflow-hidden",
                    !rows.length && "overflow-hidden"
                )}
            >
                <ReactstrapTable
                    hover
                    {...getTableProps()}
                    className={joinClassNames(
                        className,
                        isLimitEditable && "mb-0"
                    )}
                >
                    <thead className={joinClassNames("table-nowrap", headerClassName)}>
                    {headerGroups.map(headerGroup => (
                        <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} className="d-table-row">
                            {headerGroup.headers.map(column => {
                                return (
                                    <th
                                        key={column.id}
                                        className={joinClassNames(column.canSort && "cursor-pointer", column.headerClassName, 'overflow-hidden')}
                                        {...column.getHeaderProps()}
                                    >
                                        <div style={{ width: `${column.width}px` || "auto", overflow: "hidden" }}>
                                            {column.render("Header")}
                                            {column.canSort && getSortIcon(column.id, sortProviders, rows, loading)}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                    </thead>

                    {!loading && !rows.length &&
                        <section
                            className={joinClassNames("table-spinner font-weight-500 text-secondary", placeholderForSearchClassName)}>
                            {!(searchProvider?.getValue() || hasActiveFilters) ? commonPlaceholder : placeholderForSearch}
                        </section>
                    }

                    {loading ?
                        <section className="table-spinner">
                            <Spinner color="info"/>
                        </section>
                        :
                        <tbody {...getTableBodyProps()}
                               className={joinClassNames(!loading && "transition-for-collapse")}>
                        {rows.map(row => {
                            prepareRow(row);
                            const canUseCollapse = useCollapseRule(row.original);
                            const isCollapsed = canUseCollapse && collapsedState.includes(row.original.id);
                            return (
                                <React.Fragment key={row.getRowProps().key}>
                                    <tr
                                        {...row.getRowProps()}
                                        className={joinClassNames(isCollapsed && "", "d-table-row")}
                                        key={row.getRowProps().key}
                                    >
                                        {row.cells.map(cell => {
                                            const isActions = cell?.column?.id === 'actions';
                                            return (
                                                <td key={cell.id} {...cell.getCellProps()}
                                                    onClick={() => (isRowClick && !isActions) && handleRowClick(row.original?.id)}
                                                    className={joinClassNames(isRowClick && "cursor-pointer", isCollapsed && "no-border", cell.column.className)}>
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {canUseCollapse && isCollapsed &&
                                        <tr>
                                            <CollapsedComponent row={row.original}/>
                                        </tr>
                                    }
                                </React.Fragment>
                            );
                        })}
                        </tbody>
                    }
                </ReactstrapTable>
            </div>
            {!withoutPagination &&
                <section className={joinClassNames(
                    "d-flex justify-content-end items-center",
                    isLimitEditable && "justify-content-between mt-4"
                )}>
                    {isLimitEditable && !!rows.length &&
                        <section className="text-secondary d-flex align-items-center">
                            <LimitDropdown
                                onSelect={(value) => limitProvider.setValue(value)}
                                options={limitOptions}
                                value={limit}
                            />
                            Showing {pageIndex * limit + 1} - {pageIndex * limit + rows.length} of {totalCount}
                        </section>
                    }
                    {!!rows.length &&
                        <Pagination
                            goToPage={gotoPage}
                            hasPreviousPage={canPreviousPage}
                            goToPreviousPage={previousPage}
                            goToNextPage={nextPage}
                            hasNextPage={canNextPage}
                            pagesCount={pageCount}
                            currentPage={pageIndex}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                        />
                    }
                </section>
            }
        </>
    );
}

Table.propTypes = {
    data: PropTypes.array,
    dataStructure: PropTypes.any,
    HeaderComponent: PropTypes.any,
    handleTableChange: PropTypes.func,
    totalCount: PropTypes.number,
    limit: PropTypes.number,
    offset: PropTypes.number,
    isRowClick: PropTypes.bool,
    loading: PropTypes.bool,
    rowClickPath: PropTypes.string,
    searchField: PropTypes.string,
    withLocation: PropTypes.bool
};