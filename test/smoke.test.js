import { render, screen } from '@testing-library/react';
import React from 'react';

describe('Smoke test', () => {
  it('renders simple text', () => {
    render(<div>Hello Jest!</div>);
    expect(screen.getByText('Hello Jest!')).toBeInTheDocument();
  });
}); 