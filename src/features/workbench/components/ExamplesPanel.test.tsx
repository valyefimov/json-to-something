import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ExamplesPanel } from '@/features/workbench/components/ExamplesPanel';
import { YAML_EXAMPLE } from '@/features/workbench/constants';

describe('ExamplesPanel', () => {
  it('renders type examples and selects an example value', () => {
    const onSelect = vi.fn();
    render(<ExamplesPanel mode="types" onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /API response/i }));

    expect(onSelect).toHaveBeenCalledWith(expect.stringContaining('"id"'));
  });

  it('renders the gateway example in config mode', () => {
    const onSelect = vi.fn();
    render(<ExamplesPanel mode="config" onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Gateway basics/i }));

    expect(onSelect).toHaveBeenCalledWith(YAML_EXAMPLE);
  });
});
