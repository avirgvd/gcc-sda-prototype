import React from 'react';

import { Anchor, Box, Header, Menu, ResponsiveContext } from 'grommet';
import { Grommet as GrommetIcon, Menu as MenuIcon, Hpe as HPEIcon } from 'grommet-icons';

export const AppHeader = ({ children }) => (
  // Uncomment <Grommet> lines when using outside of storybook
  // <Grommet theme={...}>
  <div>
  <Header background="light-3" pad="medium" height="xsmall">
    <Anchor
      href="/"
      icon={<HPEIcon color="brand" />}
      label="Prototype"
    />
    <ResponsiveContext.Consumer>
      {(size) =>
        size === 'small' ? (
          <Box justify="end">
            <Menu
              a11yTitle="Navigation Menu"
              dropProps={{ align: { top: 'bottom', right: 'right' } }}
              icon={<MenuIcon color="brand" />}
              items={[
                {
                  label: <Box pad="small">Grommet.io</Box>,
                  href: 'https://v2.grommet.io/',
                },
                {
                  label: <Box pad="small">Feedback</Box>,
                  href: 'https://github.com/grommet/grommet/issues',
                },
              ]}
            />
          </Box>
        ) : (
          <Box justify="end" direction="row" gap="medium">
            <Anchor href="https://v2.grommet.io/" label="Grommet.io" />
            <Anchor
              href="https://github.com/grommet/grommet/issues"
              label="Feedback"
            />
          </Box>
        )
      }
    </ResponsiveContext.Consumer>
  </Header>
  {children}
  </div>
  // </Grommet>
);
