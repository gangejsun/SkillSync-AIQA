import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors'

  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  }

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
