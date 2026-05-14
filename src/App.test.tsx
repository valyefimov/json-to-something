import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '@/App';

describe('App', () => {
  it('renders the editor and generated output tabs', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'JSON-to-Something' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'JSON input' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'TypeScript' })).toBeInTheDocument();
    expect(screen.getByLabelText('Generated output')).toHaveTextContent('export interface Root');
  });
});
