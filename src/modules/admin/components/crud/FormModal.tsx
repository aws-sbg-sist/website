import React, { useEffect } from 'react';

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidthClass?: string;
  error?: string | null;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  onSubmit,
  children,
  isSubmitting = false,
  submitLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  maxWidthClass = 'max-w-2xl',
  error = null,
}) => {
  // Handle ESC key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div
        className={`relative w-full ${maxWidthClass} rounded-xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-8 animate-in fade-in-0 zoom-in-95 duration-150`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div>
            <h2 id="form-modal-title" className="text-base font-bold text-slate-900">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 disabled:opacity-50 transition-colors"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body & Form */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {error && (
              <div
                className="rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start space-x-2"
                role="alert"
              >
                <svg
                  className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {children}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-3 border-t border-slate-200 bg-slate-50/80 px-6 py-3.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {isSubmitting && (
                <div className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {isSubmitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
