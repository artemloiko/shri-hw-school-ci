import React from 'react';
import renderer from 'react-test-renderer';

import IconText from './IconText';

test('IconText with required props matches the snapshot', () => {
  const tree = renderer.create(<IconText iconType="commit" text="master" />).toJSON();

  expect(tree).toMatchSnapshot();
});

test('IconText with all possible props matches the snapshot', () => {
  const tree = renderer
    .create(
      <IconText
        iconType="commit"
        text="master"
        secondaryText="90e1126"
        className="block"
        mix={['block']}
      />,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
