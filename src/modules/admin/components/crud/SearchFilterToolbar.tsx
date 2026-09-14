import React from 'react';

export interface SearchFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  onReset?: () => void;
  isFiltered?: boolean;
  totalCount?: number;
  filteredCount?: number;
  onAddNew?: () => void;
  addNewLabel?: string;
}

export const SearchFilterToolbar: React.FC<SearchFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  children,
  onReset,
  isFiltered = false,
  totalCount,
  filteredCount,
  onAddNew,
  addNewLabel = '+ Add New',
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Action Controls & Add Button */}
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {onReset && isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <svg
                className="mr-1 h-3.5 w-3.5 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Filters
            </button>
          )}

          {totalCount !== undefined && (
            <div className="hidden md:flex items-center text-xs text-slate-500 bg-slate-100 px-2.5 py-2 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700 mr-1">
                {filteredCount !== undefined ? filteredCount : totalCount}
              </span>
              <span>
                {filteredCount !== undefined && filteredCount !== totalCount
                  ? `of ${totalCount}`
                  : 'total'}
              </span>
            </div>
          )}

          {onAddNew && (
            <button
              type="button"
              onClick={onAddNew}
              className="inline-flex items-center rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-xs transition-colors"
            >
              {addNewLabel}
            </button>
          )}
        </div>
      </div>

      {/* Filter Slots */}
      {children && (
        <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
            Filters:
          </span>
          {children}
        </div>
      )}
    </div>
  );
};
