import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with provided text', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('renders as a button element', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('applies primary variant styles by default', () => {
      render(<Button>Primary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary-600')
    })

    it('applies secondary variant styles when specified', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-white')
      expect(button).toHaveClass('border')
    })

    it('applies ghost variant styles when specified', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent')
    })
  })

  describe('Disabled State', () => {
    it('is enabled by default', () => {
      render(<Button>Enabled</Button>)
      expect(screen.getByRole('button')).toBeEnabled()
    })

    it('can be disabled', () => {
      render(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('applies disabled styles when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('opacity-50')
      expect(button).toHaveClass('cursor-not-allowed')
    })
  })

  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(<Button onClick={handleClick}>Click me</Button>)

      await user.click(screen.getByText('Click me'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      )

      await user.click(screen.getByText('Disabled'))

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Custom Props', () => {
    it('accepts additional className', () => {
      render(<Button className="custom-class">Button</Button>)
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('spreads additional HTML button attributes', () => {
      render(
        <Button type="submit" data-testid="submit-btn">
          Submit
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('data-testid', 'submit-btn')
    })
  })
})
