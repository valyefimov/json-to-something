import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { HistoryItem } from '@/features/workbench/types';
import { HistoryPanel } from '@/features/workbench/components/HistoryPanel';

const historyItem: HistoryItem = {
  createdAt: '2026-05-15T15:11:00.000Z',
  id: 'history-1',
  input: '{ "id": 1 }',
  label: 'id'
};

describe('HistoryPanel', () => {
  it('shows mode-specific empty states', () => {
    const props = {
      history: [],
      onClearHistory: vi.fn(),
      onDeleteHistoryItem: vi.fn(),
      onSelectHistoryItem: vi.fn()
    };

    const { rerender } = render(<HistoryPanel {...props} mode="types" />);
    expect(screen.getByText('Format or minify valid JSON to save a local entry.')).toBeInTheDocument();

    rerender(<HistoryPanel {...props} mode="config" />);
    expect(screen.getByText('Format YAML to save a local entry.')).toBeInTheDocument();
  });

  it('selects, deletes, and clears history entries', () => {
    const onClearHistory = vi.fn();
    const onDeleteHistoryItem = vi.fn();
    const onSelectHistoryItem = vi.fn();

    render(
      <HistoryPanel
        history={[historyItem]}
        mode="types"
        onClearHistory={onClearHistory}
        onDeleteHistoryItem={onDeleteHistoryItem}
        onSelectHistoryItem={onSelectHistoryItem}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /id/i }));
    fireEvent.click(screen.getByTitle('Delete history entry'));
    fireEvent.click(screen.getByTitle('Clear all history'));

    expect(onSelectHistoryItem).toHaveBeenCalledWith(historyItem);
    expect(onDeleteHistoryItem).toHaveBeenCalledWith('history-1');
    expect(onClearHistory).toHaveBeenCalled();
  });
});
