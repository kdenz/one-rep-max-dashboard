import { ExerciseList } from "components/ExerciseList";
import { SideMenu } from "components/SideMenu";
import { TopNavBar } from "components/TopNavBar";
import React from "react";
import styled from "styled-components";
import { OneRepMaxChart } from "components/OneRepMaxChart";

const Container = styled.div`
  height: 100vh;
  display: flex;
`;
const Content = styled.div`
  background: ${p => p.theme.detailViewBg};
  height: 100%;
  width: 100%;
`;

// These ids are needed for side menu to work
// https://github.com/negomi/react-burger-menu#properties
const OUTER_CONTAINER_ID = "outer-container-id";
const PAGE_WRAP_ID = "one-rep-mac";

export const OneRepMaxPage: React.FC = () => {
  return (
    <Container id={OUTER_CONTAINER_ID}>
      <SideMenu
        pageWrapId={PAGE_WRAP_ID}
        outerContainerId={OUTER_CONTAINER_ID}
        isDocked={true}
        noOverlay={true}
      >
        <ExerciseList
          title="Your exercises"
          data={[
            {
              name: "Barbell Bench Press",
              weight: 59.9,
              unit: "lbs"
            },
            {
              name: "Barbell Bench Press",
              weight: 59.9,
              unit: "lbs"
            }
          ]}
        />
      </SideMenu>
      <Content id={PAGE_WRAP_ID}>
        <TopNavBar title="Exercises" />
        <div style={{ marginLeft: "10%" }}>
          <OneRepMaxChart
            data={[
              { name: "Oct 1", value: 160 },
              { name: "Nov 1", value: 185 },
              { name: "Dec 1", value: 195 },
              { name: "Jan 1", value: 190 },
              { name: "Feb 1", value: 210 }
            ]}
          />
        </div>
      </Content>
    </Container>
  );
};
