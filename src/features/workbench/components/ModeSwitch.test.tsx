import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModeSwitch } from '@/features/workbench/components/ModeSwitch';

describe('ModeSwitch', () => {
  it('marks the active mode and emits mode changes', () => {
    const onSwitchMode = vi.fn();
    render(<ModeSwitch mode="types" onSwitchMode={onSwitchMode} />);

    expect(screen.getByRole('tab', { name: 'JSON to Types' })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    fireEvent.click(screen.getByRole('tab', { name: 'YAML to Envoy/Nginx' }));

    expect(onSwitchMode).toHaveBeenCalledWith('config');
  });
});
