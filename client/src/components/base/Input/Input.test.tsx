import React from 'react';
import { create } from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react';

import Input from './Input';

test('Input with all possible props matches the snapshot', () => {
  const tree = create(
    <Input
      id="commitHash"
      name="commitHash"
      placeholder="Commit hash"
      type="text"
      inputMode="text"
      required
      pattern="\w{7,}"
      title="Hash 7 letters/numbers"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChange={(): void => {}}
      onBlur={(): void => {}}
      setFieldValue={(): void => {}}
      className="block"
      mods={{ clear: true, fullwidth: true }}
      mix={['block']}
    />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

test('Input is trimming value on blur via setFieldValue call', () => {
  const setFieldValueMock = jest.fn();
  const { getByPlaceholderText } = render(
    <Input
      id="commitHash"
      name="commitHash"
      placeholder="Commit hash"
      onChange={(): void => {}}
      onBlur={(): void => {}}
      setFieldValue={setFieldValueMock}
      mods={{ clear: true }}
      data-testid="input"
    />,
  );

  fireEvent.blur(getByPlaceholderText('Commit hash'), { target: { value: '  trim  ' } });

  expect(setFieldValueMock).toHaveBeenCalledWith('commitHash', 'trim');
});

describe('Input clear button', () => {
  test('is avaible for focus', () => {
    const { getByRole } = render(
      <Input
        onChange={(): void => {}}
        onBlur={(): void => {}}
        setFieldValue={(): void => {}}
        mods={{ clear: true }}
      />,
    );
    const clearButton = getByRole('button');

    expect(clearButton).toHaveAttribute('tabindex', '0');
  });

  test('is clearing value via setFieldValue(name, value)', () => {
    const setFieldValueMock = jest.fn();
    const { getByRole } = render(
      <Input
        name="input"
        onChange={(): void => {}}
        onBlur={(): void => {}}
        setFieldValue={setFieldValueMock}
        mods={{ clear: true }}
      />,
    );
    const clearButton = getByRole('button');

    fireEvent.click(clearButton);

    expect(setFieldValueMock).toHaveBeenCalledWith('input', '');
  });

  test('is clearing on events: [click, keyDown.enter, keyDown.space]', () => {
    const setFieldValueMock = jest.fn();
    const { getByRole } = render(
      <Input
        name="input"
        onChange={(): void => {}}
        onBlur={(): void => {}}
        setFieldValue={setFieldValueMock}
        mods={{ clear: true }}
      />,
    );
    const clearButton = getByRole('button');

    fireEvent.click(clearButton);
    fireEvent.keyDown(clearButton, { key: 'Enter' });
    fireEvent.keyDown(clearButton, { key: ' ' });

    expect(setFieldValueMock).toHaveBeenCalledTimes(3);
  });

  test('is focusing input after clear', () => {
    const { getByRole, getByPlaceholderText } = render(
      <Input
        placeholder="input"
        onChange={(): void => {}}
        onBlur={(): void => {}}
        setFieldValue={(): void => {}}
        mods={{ clear: true }}
        name="input"
      />,
    );
    const input = getByPlaceholderText('input');
    const clearButton = getByRole('button');

    fireEvent.click(clearButton);

    expect(input).toHaveFocus();
  });
});
