import React from 'react';
import renderer from 'react-test-renderer';

import Icon from './Icon';

test('Icon with required props matches the snapshot', () => {
  const tree = renderer.create(<Icon mods={{ type: 'calendar' }} />).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Icon with all possible props matches the snapshot', () => {
  const tree = renderer
    .create(
      <Icon
        mods={{
          type: 'calendar',
          size: 'small',
        }}
        className="block"
        mix={['block']}
      />,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
