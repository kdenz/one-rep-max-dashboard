import React from 'react'
import { Props as MenuProps, push as Menu } from 'react-burger-menu'
import styled from 'styled-components'

const Container = styled.div`
  background: ${p => p.theme.menuBg};
  height: 100%;
`;

export interface SideMenuProps extends MenuProps {}
export const SideMenu: React.FC<SideMenuProps> = ({ ...menuProps }) => {
  return (
    <Menu {...menuProps}>
      <Container>hi</Container>
    </Menu>
  );
};
