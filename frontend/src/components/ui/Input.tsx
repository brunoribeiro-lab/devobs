'use client';

import React, { forwardRef } from 'react';
import { InputProps } from '@/types/Input';

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    {
        id,
        name,
        label,
        labelClassName,
        errorMessages = [],
        leftIcon,
        rightElement,
        className,
        wrapperClassName,
        onChange,
        ...rest
    },
    ref
) {
    const inputId = id ?? name ?? 'input';
    const hasErrors = errorMessages.length > 0;
    const errorId = hasErrors ? `${inputId}-error` : undefined;

    const inputClassName = `block w-full py-3 rounded-lg placeholder-gray-400 text-gray-900 focus:ring-2
        ${leftIcon ? 'pl-10' : 'pl-3'}
        ${rightElement ? 'pr-12' : 'pr-3'}
        ${hasErrors
            ? 'border border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border border-gray-300 focus:ring-[#02b3f3] focus:border-[#02b3f3]'}
        ${rest?.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
        ${className ?? ''}`;

    const defaultLabelClass = 'block text-sm font-medium text-gray-700 mb-2';

    return (
        <div className={wrapperClassName}>
            {label && (
                <label htmlFor={inputId} className={`${defaultLabelClass} ${labelClassName ?? ''}`}>
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    name={name}
                    ref={ref}
                    aria-invalid={hasErrors}
                    aria-describedby={errorId}
                    onChange={onChange}
                    className={inputClassName}
                    {...rest}
                />

                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>

            {hasErrors && (
                <ul id={errorId} className="mt-2 space-y-1">
                    {errorMessages.map((msg, i) => (
                        <li key={i} className="text-sm text-red-600">{msg}</li>
                    ))}
                </ul>
            )}
        </div>
    );
});

export default Input;
