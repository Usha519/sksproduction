// Pagination.js
import React from "react";

const Pagination = ({ currentPage, coursesPerPage, totalCourses, onPageChange }) => {
  const pageNumbers = Math.ceil(totalCourses / coursesPerPage);

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageArray = Array.from({ length: pageNumbers }, (_, index) => index + 1);

    const MAX_VISIBLE_PAGES = 3; // Change this to your desired limit

    const visiblePages = getVisiblePages(pageArray, currentPage, MAX_VISIBLE_PAGES);

    return (
      <nav className="pagination-container cont">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link btn-sm "
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {visiblePages.map((item, index) => (
            <li
              key={index}
              className={`page-item ${item === 'ellipsis' ? 'disabled' : ''} ${currentPage === item ? 'active' : ''}`}
            >
              {item === 'ellipsis' ? (
                <span className="page-link">...</span>
              ) : (
                <button className="page-link" onClick={() => handlePageClick(item)}>
                  {item}
                </button>
              )}
            </li>
          ))}
          <li className={`page-item ${currentPage === pageNumbers ? 'disabled' : ''}`}>
            <button
              className="page-link "
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === pageNumbers}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return <>{renderPageNumbers()}</>;
};

const getVisiblePages = (pageArray, currentPage, maxVisiblePages) => {
  const pageNumbers = pageArray.length;

  if (pageNumbers <= maxVisiblePages) {
    return pageArray;
  }

  const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

  if (currentPage <= halfMaxVisiblePages + 1) {
    return [...pageArray.slice(0, maxVisiblePages - 1), "ellipsis", pageNumbers];
  } else if (currentPage >= pageNumbers - halfMaxVisiblePages) {
    return [1, "ellipsis", ...pageArray.slice(pageNumbers - maxVisiblePages + 2)];
  } else {
    return [
      1,
      "ellipsis",
      ...pageArray.slice(currentPage - halfMaxVisiblePages, currentPage + halfMaxVisiblePages - 1),
      "ellipsis",
      pageNumbers,
    ];
  }
};

export default Pagination;
