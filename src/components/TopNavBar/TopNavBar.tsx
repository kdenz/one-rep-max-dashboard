import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background: ${p => p.theme.primary};
  height: 57px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.white};
`;

interface TopNavBarProps {
  title: string;
}
export const TopNavBar: React.FC<TopNavBarProps> = ({ title }) => {
  return <Container>{title}</Container>;
};
