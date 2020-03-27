import React from 'react';
import { render } from '@testing-library/react';
import Page from './Page';

test('renders page header', () => {
  const { getByText } = render(<Page />);
  const header = getByText(/School CI server/i);
  expect(header).toBeInTheDocument();
});
