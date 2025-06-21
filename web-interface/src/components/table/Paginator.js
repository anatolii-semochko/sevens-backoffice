import React from "react";
import { CPagination, CPaginationItem } from "@coreui/react";

const PaginatorInfo = ({
  currentPage,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 20, 50, 100],
  onPageSizeChange = () => {},
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageSizeChange = (e) => {
    onPageSizeChange(Number(e.target.value));
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <span>Show:</span>
      <select
        value={pageSize}
        onChange={handlePageSizeChange}
        className="form-select form-select-sm"
        style={{ width: "auto" }}
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span>
        {startItem}-{endItem} from {totalItems}
      </span>
    </div>
  );
};

const PaginatorControls = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange = () => {},
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalItems <= pageSize) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPages = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <CPaginationItem
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </CPaginationItem>
      );
    }
    return items;
  };

  return (
    <CPagination aria-label="Page navigation">
      {totalPages >= 4 && (
        <CPaginationItem
          title="First Page"
          aria-label="First"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          &laquo;&laquo;
        </CPaginationItem>
      )}
      <CPaginationItem
        title="Previous Page"
        aria-label="Previous"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        &laquo;
      </CPaginationItem>

      {renderPages()}

      <CPaginationItem
        title="Next Page"
        aria-label="Next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        &raquo;
      </CPaginationItem>
      {totalPages >= 4 && (
        <CPaginationItem
          title="Last Page"
          aria-label="Last"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          &raquo;&raquo;
        </CPaginationItem>
      )}
    </CPagination>
  );
};

export { PaginatorInfo, PaginatorControls };
