import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App';

describe('App', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        clear: () => storage.clear(),
        getItem: (key: string) => storage.get(key) ?? null,
        removeItem: (key: string) => storage.delete(key),
        setItem: (key: string, value: string) => storage.set(key, value)
      }
    });
    window.history.replaceState(null, '', window.location.pathname);
  });

  it('renders the editor and generated output tabs', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: 'JSON to TypeScript, Zod, JSON Schema and YAML config converter'
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'JSON input' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'TypeScript' })).toBeInTheDocument();
    expect(screen.getByLabelText('Generated output')).toHaveTextContent('export interface Root');
    expect(screen.queryByText('Local history')).not.toBeInTheDocument();
    expect(screen.queryByText(/Hotkeys:/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Show instructions'));

    expect(screen.getByText(/Your data stays local/)).toBeInTheDocument();
    expect(screen.getByText(/Hotkeys: Ctrl\/Cmd\+Enter/)).toBeInTheDocument();
    expect(screen.getByText(/Created by Valentyn Yefimov/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open source on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/valyefimov/json-to-something'
    );
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('switches to config mode and shows nginx output', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('tab', { name: 'YAML to Envoy/Nginx' }));

    expect(screen.getByRole('textbox', { name: 'YAML input' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Nginx' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText('Generated output')).toHaveTextContent('upstream users_api');
  });

  it('formats input and updates the editor output', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Format' }));

    expect(screen.getByLabelText('Generated output')).toHaveTextContent('export interface Root');
  });

  it('copies generated output to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    });

    render(<App />);

    fireEvent.click(screen.getByTitle('Copy output'));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Root')));
    expect(await screen.findByTitle('Copied')).toBeInTheDocument();
  });
});
