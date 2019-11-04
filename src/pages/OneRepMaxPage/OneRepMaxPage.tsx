import { SideMenu } from 'components/SideMenu'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 100vh;
`;
const Content = styled.div``;

// These ids are needed for side menu to work
// https://github.com/negomi/react-burger-menu#properties
const OUTER_CONTAINER_ID = "outer-container-id";
const PAGE_WRAP_ID = "one-rep-mac";

export const OneRepMaxPage: React.FC = () => {
  return (
    <Container id={OUTER_CONTAINER_ID}>
      <SideMenu pageWrapId={PAGE_WRAP_ID} />
      <Content id={PAGE_WRAP_ID}>hi</Content>
    </Container>
  );
};
