
"use client"

import React, { useState } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  const [visible, setVisible] = useState(false)

  const isPassword = props.type === 'password'
  const { value, defaultValue, ...inputProps } = props
  const isControlled = value !== undefined
  const normalizedInputProps = isControlled
    ? { ...inputProps, value }
    : { ...inputProps, ...(defaultValue !== undefined ? { defaultValue } : {}) }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {isPassword ? (
        <div className="relative">
          <input
            className={
              `w-full px-4 py-2 border border-gray-300 rounded-lg pr-10
              focus:outline-none focus:ring-2 focus:ring-green-500
              focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : ''} ${className}`
            }
            {...normalizedInputProps}
            type={visible ? 'text' : 'password'}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {visible ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 5c-4.97 0-9.27 3.28-10.84 8 1.57 4.72 5.87 8 10.84 8 4.97 0 9.27-3.28 10.84-8C21.27 8.28 16.97 5 12 5zm0 14c-3.54 0-6.59-2.29-7.75-5.5C5.41 10.29 8.46 8 12 8s6.59 2.29 7.75 5.5C18.59 16.71 15.54 19 12 19zm-2-6c0-.55.45-1 1-1h2c.55 0 1 .45 1 1s-.45 1-1 1h-2c-.55 0-1-.45-1-1z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 5c-4.97 0-9.27 3.28-10.84 8 1.57 4.72 5.87 8 10.84 8 4.97 0 9.27-3.28 10.84-8C21.27 8.28 16.97 5 12 5zm0 14c-3.54 0-6.59-2.29-7.75-5.5C5.41 10.29 8.46 8 12 8s6.59 2.29 7.75 5.5C18.59 16.71 15.54 19 12 19zM12 10c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
            )}
          </button>
        </div>
      ) : (
        <input
          className={
            `w-full px-4 py-2 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-green-500
            focus:border-transparent transition
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${props.type === 'number' ? 'appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none -moz-appearance:textfield' : ''}
            ${error ? 'border-red-500' : ''}
            ${className}`
          }
          {...normalizedInputProps}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-green-500
          focus:border-transparent transition
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
