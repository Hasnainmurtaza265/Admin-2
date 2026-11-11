import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  id = 'pagination',
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      id={id}
      className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-400"
    >
      <div>
        Showing <span className="font-medium text-slate-900 dark:text-white">{totalItems > 0 ? startItem : 0}</span> to{' '}
        <span className="font-medium text-slate-900 dark:text-white">{endItem}</span> of{' '}
        <span className="font-medium text-slate-900 dark:text-white">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-1.5">
        <button
          id={`${id}-prev-btn`}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            id={`${id}-page-${page}-btn`}
            onClick={() => onPageChange(page)}
            className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white shadow-xs'
                : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          id={`${id}-next-btn`}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
