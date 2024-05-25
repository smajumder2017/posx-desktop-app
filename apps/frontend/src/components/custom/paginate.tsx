import { useState, memo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from '../ui/pagination';

interface IPaginateProps {
  itemsPerPage: number;
  totalCount: number;
  maxPages: number;
  onChange?: (page: number) => void;
  value?: number;
}

const createPages = (take: number, total: number) => {
  const totalPages =
    total % take > 0 ? Math.floor(total / take) + 1 : Math.floor(total / take);

  const pages = Array.from({ length: totalPages }).map((_, index) => index);
  return pages;
};

export const Paginate: React.FC<IPaginateProps> = memo(
  ({ totalCount, maxPages, itemsPerPage, value, onChange }) => {
    const pages = createPages(itemsPerPage, totalCount);
    const maxPageLinks = maxPages || 5;
    const [pageSliceValue, setPageSliceValue] = useState(0);

    const handlePageClick = (value: number) => {
      console.log(value);
      onChange?.(value);
    };

    const handlePrevItemClick = () => {
      handlePageClick(pageSliceValue - 1);
      setPageSliceValue((prev) => prev - maxPageLinks);
    };

    const handlePrevClick = () => {
      if (!value) {
        return;
      }
      const newValue = value ? value - 1 : 0;
      handlePageClick(newValue);
      if (value && newValue < pageSliceValue)
        setPageSliceValue((prev) => prev - maxPageLinks);
    };

    const handleNextItemClick = () => {
      handlePageClick(pageSliceValue + maxPageLinks);
      setPageSliceValue((prev) => prev + maxPageLinks);
    };

    const handleNextClick = () => {
      if (value === pages[pages.length - 1]) {
        return;
      }

      const newValue = (value || 0) + 1;
      handlePageClick(newValue);
      if (value && newValue >= pageSliceValue + maxPageLinks)
        setPageSliceValue((prev) => prev + maxPageLinks);
    };

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem onClick={handlePrevClick}>
            <PaginationPrevious
              className={`${!value ? 'text-gray-400 cursor-not-allowed' : ''}`}
            />
          </PaginationItem>
          {pageSliceValue > 0 && (
            <PaginationItem
              onClick={handlePrevItemClick}
              className="cursor-pointer"
            >
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {totalCount &&
            pages
              .slice(pageSliceValue, maxPageLinks + pageSliceValue)
              .map((page) => {
                return (
                  <PaginationItem
                    key={page}
                    onClick={() => handlePageClick(page)}
                  >
                    <PaginationLink isActive={page === (value || 0)}>
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
          {(maxPageLinks + pageSliceValue) * itemsPerPage < totalCount && (
            <PaginationItem
              onClick={handleNextItemClick}
              className="cursor-pointer"
            >
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem onClick={handleNextClick}>
            <PaginationNext
              href="#"
              onClick={(e) => e.preventDefault()}
              className={`${
                value === pages[pages.length - 1]
                  ? 'text-gray-400 cursor-not-allowed'
                  : ''
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  },
);
