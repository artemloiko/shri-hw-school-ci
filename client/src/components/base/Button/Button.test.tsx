import React from 'react';
import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import Button from './Button';

test('Button with default props matches the snapshot', () => {
  const tree = create(<Button>Default button</Button>).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Button[type=link] with all props matches the snapshot', () => {
  const tree = create(
    <Button iconType="play" className="block" mods={{ action: true }} to="/" mix={['block']}>
      Link
    </Button>,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Button[type=submit] with all props matches the snapshot', () => {
  const tree = create(
    <Button iconType="play" className="block" mods={{ action: true }} type="submit" mix={['block']}>
      Button
    </Button>,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Button[disabled] is not focusable or clickable', () => {
  const { getByTestId, rerender } = render(
    <Button mods={{ disabled: true }} to="/" data-testid="btn">
      Link
    </Button>,
  );

  expect(getByTestId('btn')).toHaveAttribute('tabindex', '-1');
  expect(getByTestId('btn')).toHaveClass('button_disabled');

  rerender(
    <Button mods={{ disabled: true }} data-testid="btn">
      Link
    </Button>,
  );
  expect(getByTestId('btn')).toBeDisabled();
});
