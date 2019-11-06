/**
 * This is a reusable component which shows the orange top nav bar within
 * the exercise detail section. It shows the hamburger menu button only
 * for small screens, because on larger screens SideMenu docks itself anyways
 */
import React, { memo } from "react";
import styled from "styled-components";
import Hamburger from "assets/hamburger.svg";
import ReactSVG from "react-svg";
import { useWindowSize } from "hooks/useWindowSize";

const Container = styled.div`
  background: ${p => p.theme.primary};
  height: 57px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${p => p.theme.white};
`;

const IconButton = styled.div`
  margin-left: 20px;
  cursor: pointer;
`;

const Filler = styled.div`
  width: 18px;
`;

export interface TopNavBarProps {
  title: string;
  onMenuClick: () => void;
}
export const TopNavBar: React.FC<TopNavBarProps> = memo(
  ({ title, onMenuClick }) => {
    const { width } = useWindowSize();

    return (
      <Container>
        {width && width < 500 ? (
          <IconButton onClick={onMenuClick} data-testid="BurgerMenuButton">
            <ReactSVG src={Hamburger} />
          </IconButton>
        ) : (
          <Filler />
        )}
        <div>{title}</div>
        <Filler />
      </Container>
    );
  }
);
