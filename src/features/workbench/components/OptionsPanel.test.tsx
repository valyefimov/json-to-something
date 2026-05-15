import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OptionsPanel } from '@/features/workbench/components/OptionsPanel';
import { defaultOptions } from '@/lib/transform';

describe('OptionsPanel', () => {
  it('updates text and checkbox options', () => {
    const onUpdateOption = vi.fn();
    render(
      <OptionsPanel mode="types" onUpdateOption={onUpdateOption} options={defaultOptions} />
    );

    fireEvent.change(screen.getByLabelText('Root type name'), { target: { value: 'User' } });
    fireEvent.click(screen.getByLabelText('Readonly fields'));

    expect(onUpdateOption).toHaveBeenCalledWith('rootName', 'User');
    expect(onUpdateOption).toHaveBeenCalledWith('readonly', true);
  });

  it('shows config instructions in config mode', () => {
    render(
      <OptionsPanel mode="config" onUpdateOption={vi.fn()} options={defaultOptions} />
    );

    expect(screen.getByText(/YAML mode expects/)).toBeInTheDocument();
  });
});
