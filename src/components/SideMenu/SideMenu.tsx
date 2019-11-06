import React, { memo } from "react";
import { Props as MenuProps, push as Menu } from "react-burger-menu";
import styled from "styled-components";
import { useWindowSize } from "hooks/useWindowSize";
import ReactSVG from "react-svg";
import Logo from "assets/logo.svg";

const Container = styled.div`
  background: ${p => p.theme.menuBg};
  height: 100%;
  min-width: 259px;
  overflow: auto;
`;

const LogoContainer = styled.div<{ left: number }>`
  position: fixed;
  bottom: 44px;
  left: ${p => p.left}px;
`;

const Overlay = styled.div<{ isActive: boolean }>`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: ${p => (p.isActive ? 10 : -100)};
`;

export interface SideMenuProps extends MenuProps {
  isOpen: boolean;
  onCloseMenu: () => void;
}
export const SideMenu: React.FC<SideMenuProps> = memo(
  ({ children, isOpen, onCloseMenu, ...menuProps }) => {
    const { width } = useWindowSize();

    const isBigScreen = width && width > 500;

    const content = (
      <Container>
        {children}
        <LogoContainer left={isBigScreen ? 55 : 80}>
          <ReactSVG src={Logo} />
        </LogoContainer>
      </Container>
    );

    // (On bigger screens) Return the docked version without dynamic side menu
    if (isBigScreen) return content;

    return (
      <>
        <Menu
          {...menuProps}
          customBurgerIcon={false}
          customCrossIcon={false}
          isOpen={isOpen}
        >
          {content}
        </Menu>
        <Overlay isActive={isOpen} onClick={onCloseMenu} />
      </>
    );
  }
);
