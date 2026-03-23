"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

type PaginationProps = {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}
