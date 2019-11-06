import React, { memo } from "react";
import { Props as MenuProps, push as Menu } from "react-burger-menu";
import styled from "styled-components";
import { useWindowSize } from "hooks/useWindowSize";

const Container = styled.div`
  background: ${p => p.theme.menuBg};
  height: 100%;
  min-width: 259px;
  overflow: auto;
`;

export interface SideMenuProps extends MenuProps {}
export const SideMenu: React.FC<SideMenuProps> = memo(
  ({ children, isOpen, ...menuProps }) => {
    const { width } = useWindowSize();

    if (width && width > 500) return <Container>{children}</Container>;

    return (
      <Menu
        {...menuProps}
        customBurgerIcon={false}
        customCrossIcon={false}
        isOpen={isOpen}
      >
        <Container>{children}</Container>
      </Menu>
    );
  }
);
