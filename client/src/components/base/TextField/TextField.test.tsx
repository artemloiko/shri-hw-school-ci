import React from 'react';
import renderer from 'react-test-renderer';

import TextField from './TextField';

test('TextField with all possible props matches the snapshot', () => {
  const tree = renderer
    .create(
      <TextField
        label="Label"
        htmlFor="input"
        appendText="appendText"
        mods={{
          required: true,
          row: true,
        }}
        className="block"
        mix={['block']}
      >
        <input type="text" id="input" />
      </TextField>,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
