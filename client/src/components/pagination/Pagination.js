import * as React from "react";
import ReactPagination from "react-paginate";
import "./Pagination.css";

export const Pagination = ({
  handlePageClick,
  pageCount,
  currentPage,
  pageRangeDisplayed = 3,
  marginPagesDisplayed = 3,
}) => {
  return (
    <ReactPagination
      className="pagination"
      pageClassName="cursor-pointer"
      pageLinkClassName="p-2"
      activeClassName="active"
      breakLabel="..."
      nextLabel="&raquo;"
      previousLabel="&laquo;"
      onPageChange={handlePageClick}
      pageRangeDisplayed={pageRangeDisplayed}
      marginPagesDisplayed={marginPagesDisplayed}
      pageCount={pageCount}
      previousLinkClassName="p-2"
      nextLinkClassName="p-2"
      previousClassName="cursor-pointer !rounded-full"
      nextClassName="cursor-pointer !rounded-full"
      renderOnZeroPageCount={null}
      forcePage={currentPage ? currentPage - 1 : undefined}
    ></ReactPagination>
  );
};

export default function BasicPagination({
  pageCount,
  handlePageClick,
  children,
  currentPage,
  isEmpty = false,
}) {
  return (
    <>
      {children}
      {!isEmpty && (
        <div className="flex justify-end mt-6">
          <Pagination
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            currentPage={currentPage}
          ></Pagination>
        </div>
      )}
    </>
  );
}
