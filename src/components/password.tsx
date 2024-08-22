import React from 'react';

import { Hide, View } from 'grommet-icons';
import { Box, Button, TextInput } from 'grommet';

export const Password = ({
    name,
    value,
    placeholder,
    onChange
  }: {
    name: string;
    placeholder: string;
    value: string;
    onChange: (() => {});
  }) => {
//   const [value, setValue] = React.useState('');
  const [reveal, setReveal] = React.useState(false);

  return (
    // Uncomment <Grommet> lines when using outside of storybook
    // <Grommet theme={...}>
    <Box
      direction="row"
      round="xsmall"
      border
    >
      <TextInput
        plain
        name={name}
        type={reveal ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        aria-label="Input Password"
      />
      <Button
        icon={reveal ? <View size="medium" /> : <Hide size="medium" />}
        onClick={() => setReveal(!reveal)}
      />
    </Box>
    // </Grommet>
  );
};