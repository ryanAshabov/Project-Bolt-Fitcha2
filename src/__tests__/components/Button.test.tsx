/**
 * Button Component Tests
 * 
 * This file contains unit tests for the Button component.
 * Tests cover different variants, sizes, states and user interactions.
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import { Button } from '../../components/ui/Button';

describe('Button Component', () => {
  it('renders button with text content', () => {
    render(<Button>Click Me</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('bg-slate-600');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('px-3', 'py-1.5');

    rerender(<Button size="lg">Large</Button>);
    buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('px-6', 'py-3');
  });

  it('handles disabled state correctly', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>,
    );
    
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
    
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('custom-class');
  });
});
