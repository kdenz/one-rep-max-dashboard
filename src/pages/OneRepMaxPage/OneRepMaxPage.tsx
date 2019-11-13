/**
 * This is the only page of the app so far, which wraps a side menu list of exercises
 * around the 1RM chart page, which shows the historical 1RM chart for selected exercise
 */
import {
  ExerciseList,
  ExerciseListProps,
  ListItem
} from "components/ExerciseList";
import { SideMenu } from "components/SideMenu";
import { TopNavBar } from "components/TopNavBar";
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { OneRepMaxChart, OneRepMaxChartProps } from "components/OneRepMaxChart";
import { loadExerciseDict, ExerciseDict } from "services/chartService";
import LoadingOverlay from "react-loading-overlay";

const Container = styled.div`
  height: 100vh;
  display: flex;
`;
const Content = styled.div`
  background: ${p => p.theme.detailViewBg};
  height: 100%;
  width: 100%;
  overflow: auto;
`;

// These ids are needed for side menu to work
// https://github.com/negomi/react-burger-menu#properties
const OUTER_CONTAINER_ID = "outer-container-id";
const PAGE_WRAP_ID = "one-rep-mac";

// global var for storing the exerciseDict in memory
let exerciseDict: ExerciseDict = {};

export const OneRepMaxPage: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseListProps["data"]>([]);
  const [chartData, setChartData] = useState<OneRepMaxChartProps["data"]>([]);
  const [highest1RM, setHighest1RM] = useState<number>(0);
  const [pageTitle, setPageTitle] = useState();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initializes data
  useEffect(() => {
    async function loadData() {
      try {
        const currentDict = await loadExerciseDict();
        exerciseDict = currentDict;

        // Initializes exercise list based on exercise dict object
        const exercises: ExerciseListProps["data"] = [];
        for (const key in exerciseDict) {
          if (exerciseDict.hasOwnProperty(key)) {
            // Transform exercise dict into exercise list
            exercises.push({
              id: exerciseDict[key].id,
              highestWeight: exerciseDict[key].highest1RM,
              name: exerciseDict[key].name
            });
          }
        }

        setExercises(exercises);
      } catch (err) {
        alert(`Oops sorry, something is wrong with the server`);
      } finally {
        setIsLoading(false);
        setIsSideMenuOpen(true);
      }
    }

    setIsLoading(true);
    loadData();
  }, []);

  // When user click on an exercise, close side menu and update the exercise detail page
  const onExerciseClick = useCallback((exercise: ListItem) => {
    // Used to help smoothen transition animation a bit
    requestAnimationFrame(() => {
      setIsSideMenuOpen(false);
    });

    setChartData(exerciseDict[exercise.id].history);
    setHighest1RM(exercise.highestWeight);
    setPageTitle(exercise.name);
  }, []);

  // toggles on and off for the side menu
  const toggleSideMenu = useCallback(() => {
    setIsSideMenuOpen(prev => !prev);
  }, []);

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text="Initializing a lot of data..."
    >
      <Container id={OUTER_CONTAINER_ID}>
        <SideMenu
          pageWrapId={PAGE_WRAP_ID}
          outerContainerId={OUTER_CONTAINER_ID}
          noOverlay={true}
          isOpen={isSideMenuOpen}
          onCloseMenu={toggleSideMenu}
        >
          <ExerciseList
            title="Your exercises"
            data={exercises}
            onItemClick={onExerciseClick}
          />
        </SideMenu>
        <Content id={PAGE_WRAP_ID}>
          <TopNavBar
            title={pageTitle || "Please select an exercise"}
            onMenuClick={toggleSideMenu}
          />
          <div style={{ marginLeft: "10%" }}>
            {chartData.length ? (
              <OneRepMaxChart data={chartData} highest1RM={highest1RM} />
            ) : null}
          </div>
        </Content>
      </Container>
    </LoadingOverlay>
  );
};
