import React from 'react';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  className = '',
  children,
}) => {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const hintId = htmlFor ? `${htmlFor}-hint` : undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold text-slate-700"
        >
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
        {hint && (
          <span id={hintId} className="text-[11px] text-slate-400">
            {hint}
          </span>
        )}
      </div>

      <div>{children}</div>

      {error && (
        <p
          id={errorId}
          className="text-xs font-medium text-rose-600 flex items-center space-x-1"
          role="alert"
        >
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

// ============================================================================
// Standard Styled Form Controls
// ============================================================================

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  hasError = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <input
      disabled={disabled}
      aria-invalid={hasError ? 'true' : undefined}
      className={`w-full rounded-lg border bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-hidden focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
        hasError
          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
          : 'border-slate-300 focus:border-amber-500 focus:ring-amber-500/20'
      } ${className}`}
      {...props}
    />
  );
};

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  hasError = false,
  className = '',
  rows = 3,
  disabled,
  ...props
}) => {
  return (
    <textarea
      rows={rows}
      disabled={disabled}
      aria-invalid={hasError ? 'true' : undefined}
      className={`w-full rounded-lg border bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-hidden focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
        hasError
          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
          : 'border-slate-300 focus:border-amber-500 focus:ring-amber-500/20'
      } ${className}`}
      {...props}
    />
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  hasError = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  return (
    <select
      disabled={disabled}
      aria-invalid={hasError ? 'true' : undefined}
      className={`w-full rounded-lg border bg-white px-3 py-2 text-xs text-slate-900 transition-colors focus:outline-hidden focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
        hasError
          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
          : 'border-slate-300 focus:border-amber-500 focus:ring-amber-500/20'
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};
