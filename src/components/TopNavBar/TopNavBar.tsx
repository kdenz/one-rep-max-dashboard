import React from "react";
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
`;

interface TopNavBarProps {
  title: string;
  onMenuClick: () => void;
}
export const TopNavBar: React.FC<TopNavBarProps> = ({ title, onMenuClick }) => {
  const { width } = useWindowSize();

  return (
    <Container>
      {width && width < 500 ? (
        <IconButton onClick={onMenuClick}>
          <ReactSVG src={Hamburger} />
        </IconButton>
      ) : (
        <div> </div>
      )}
      <div>{title}</div>
      <div> </div>
    </Container>
  );
};
