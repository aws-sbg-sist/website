import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface CRUDTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onArchive?: (item: T) => void;
  renderCustomActions?: (item: T) => React.ReactNode;
  actionsColumnHeader?: string;
}

export function CRUDTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyMessage = 'Get started by creating your first entry.',
  onEdit,
  onDelete,
  onArchive,
  renderCustomActions,
  actionsColumnHeader = 'Actions',
}: CRUDTableProps<T>): React.ReactElement {
  const hasActions = Boolean(onEdit || onDelete || onArchive || renderCustomActions);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-amber-500 border-t-transparent" />
          <p className="mt-3 text-sm font-medium text-slate-600">Loading records...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-900">{emptyTitle}</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 font-semibold uppercase tracking-wider text-slate-600 ${
                    col.headerClassName || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold uppercase tracking-wider text-slate-600 text-right"
                >
                  {actionsColumnHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => {
              const rowKey = keyExtractor(item);
              return (
                <tr
                  key={rowKey}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {columns.map((col) => {
                    return (
                      <td
                        key={`${rowKey}-${col.key}`}
                        className={`px-4 py-3 text-slate-700 align-middle ${
                          col.className || ''
                        }`}
                      >
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key] ?? '—')}
                      </td>
                    );
                  })}

                  {hasActions && (
                    <td className="px-4 py-3 text-right align-middle whitespace-nowrap">
                      <div className="inline-flex items-center justify-end space-x-1.5">
                        {renderCustomActions && renderCustomActions(item)}

                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            aria-label="Edit item"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                        )}

                        {onArchive && (
                          <button
                            type="button"
                            onClick={() => onArchive(item)}
                            className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50/60 px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 hover:border-amber-300 transition-colors"
                            aria-label="Archive item"
                          >
                            <svg
                              className="mr-1 h-3.5 w-3.5 text-amber-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                            Archive
                          </button>
                        )}

                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50/60 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition-colors"
                            aria-label="Delete item"
                          >
                            <svg
                              className="mr-1 h-3.5 w-3.5 text-rose-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-[11px] text-slate-500 flex justify-between items-center">
        <span>Showing {data.length} {data.length === 1 ? 'record' : 'records'}</span>
        <span className="text-slate-400">AWS Student Builder Group Portal</span>
      </div>
    </div>
  );
}
