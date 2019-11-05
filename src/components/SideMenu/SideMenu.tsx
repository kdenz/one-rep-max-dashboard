import React from 'react'
import { Props as MenuProps, push as Menu } from 'react-burger-menu'
import styled from 'styled-components'

const Container = styled.div`
  background: ${p => p.theme.menuBg};
  height: 100%;
  min-width: 259px;
  overflow: auto;
`;

export interface SideMenuProps extends MenuProps {
  isDocked?: boolean;
}
export const SideMenu: React.FC<SideMenuProps> = ({
  children,
  isDocked,
  ...menuProps
}) => {
  if (isDocked) return <Container>{children}</Container>;
  return (
    <Menu
      {...menuProps}
      customBurgerIcon={false}
      customCrossIcon={false}
      isOpen={true}
    >
      <Container>{children}</Container>
    </Menu>
  );
};
