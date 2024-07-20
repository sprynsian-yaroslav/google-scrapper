import React from "react";
import joinClassNames from "../../helpers/joinClassNames";

const getPageNumbers = (currentPage, maxPages) => {

  const arrayOfPageNumbers = Array.from({ length: maxPages > 5 ? 5 : maxPages })

  if (arrayOfPageNumbers.length === 1) return [currentPage];

  if (currentPage === maxPages - 1) {
    arrayOfPageNumbers[arrayOfPageNumbers.length - 1] = currentPage;
  }
  if (currentPage === maxPages - 2) {
    arrayOfPageNumbers[arrayOfPageNumbers.length - 2] = currentPage;
  }
  if (currentPage === 0) {
    arrayOfPageNumbers[0] = currentPage;
  }
  if (currentPage === 1) {
    arrayOfPageNumbers[1] = currentPage;
  }
  if (arrayOfPageNumbers.length >= 5 && !arrayOfPageNumbers.some(item => !!item || item === 0)) {
    arrayOfPageNumbers[2] = currentPage;
  }

  const insertedPageIndex = arrayOfPageNumbers.findIndex(item => !!item || item === 0);

  return arrayOfPageNumbers.map((pageNumber, index) => {
    if (pageNumber) return pageNumber;
    return currentPage + (index - insertedPageIndex)
  })
}

export default function Pagination({
  goToPage,
  hasPreviousPage,
  goToPreviousPage,
  goToNextPage,
  hasNextPage,
  pagesCount,
  currentPage,
}) {
  return (
    <div className="pagination-rounded">
      <button
        onClick={() => goToPreviousPage()}
        disabled={!hasPreviousPage}
        className={joinClassNames("page-link", !hasPreviousPage && "disabled-pagination pointer-events-none" )}
      >
        {'<'}
      </button>

      {getPageNumbers(currentPage, pagesCount).map((page, index) => {
        return (
          <button onClick={() => goToPage(page)}
                  className={joinClassNames("page-link", page === currentPage && "active")} key={index}>
            {page + 1}
          </button>
        )
      })}

      <button
        onClick={() => goToNextPage()}
        disabled={!hasNextPage}
        className={joinClassNames("page-link", !hasNextPage && "disabled-pagination pointer-events-none")}
      >
        {'>'}
      </button>
    </div>
  )
}