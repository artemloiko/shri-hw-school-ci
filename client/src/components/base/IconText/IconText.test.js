import React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import { act } from 'react-dom/test-utils';

import IconText from './IconText';

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('IconText renders main text', () => {
  const mainText = 'Author';

  act(() => {
    render(<IconText iconType="commit" text={mainText} />, container);
  });
  expect(container.textContent).toBe(mainText);
});

it('IconText renders main and secondary text', () => {
  const mainText = 'Author';
  const secondaryText = 'Commit';

  act(() => {
    render(<IconText iconType="commit" text={mainText} secondaryText={secondaryText} />, container);
  });

  expect(container.textContent).toBe(mainText + secondaryText);
});
