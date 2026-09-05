'use client';

import React, { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from './utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      id: customId,
      disabled,
      required,
      className,
      containerClassName,
      leftIcon,
      rightIcon,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Construct aria-describedby merged with caller's aria-describedby
    const describedBy = [
      props['aria-describedby'],
      error ? errorId : null,
      helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={cn('w-full space-y-1.5 text-left', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#F8FAFC]"
          >
            {label}
            {required && (
              <span className="text-[#FF9900] ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div
              className="absolute left-3 flex items-center justify-center text-[#64748B] pointer-events-none [&>svg]:w-4 [&>svg]:h-4"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            required={required}
            {...props}
            aria-invalid={error ? true : props['aria-invalid']}
            aria-describedby={describedBy}
            aria-required={required ? true : props['aria-required']}
            className={cn(
              // Base
              'w-full h-10 px-3 py-2 text-sm rounded-[6px] text-[#F8FAFC] placeholder-[#64748B]',
              'bg-[#0E1420] border transition-colors duration-150 ease-out',
              // Dynamic borders
              error
                ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]'
                : 'border-[#2B384E] hover:border-[#384865] focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]',
              // Outline
              'outline-none',
              // Padding when icons present
              leftIcon && 'pl-9',
              (rightIcon || error) && 'pr-9',
              // Disabled
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#080C14]',
              className
            )}
          />

          {error ? (
            <div
              className="absolute right-3 flex items-center justify-center text-[#EF4444] pointer-events-none"
              aria-hidden="true"
            >
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : rightIcon ? (
            <div
              className="absolute right-3 flex items-center justify-center text-[#64748B] pointer-events-none [&>svg]:w-4 [&>svg]:h-4"
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          ) : null}
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs font-medium text-[#EF4444]">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-[#94A3B8]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
