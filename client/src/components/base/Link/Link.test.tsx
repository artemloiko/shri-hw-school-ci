import React from 'react';
import renderer from 'react-test-renderer';

import Link from './Link';

test('Link with default props matches the snapshot', () => {
  const tree = renderer.create(<Link to="/path">Link</Link>).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Link with all possible props matches the snapshot', () => {
  const tree = renderer
    .create(
      <Link className="block" mix={['block']} to="/path">
        Link
      </Link>,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
