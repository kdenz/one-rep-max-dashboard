import React from "react";
import { render } from "@testing-library/react";
import { ExerciseList } from "./ExerciseList";
import { theme } from "styles/theme";
import { ThemeProvider } from "styled-components";

const component = (
  <ThemeProvider theme={theme}>
    <ExerciseList
      title="Your exercises"
      data={[
        { id: 1, name: "Push up", highestWeight: 70 },
        { id: 2, name: "Pull up", highestWeight: 70 }
      ]}
      onItemClick={jest.fn()}
    />
  </ThemeProvider>
);

it("shows the list of exercises when data is present", () => {
  const { getByText } = render(component);

  expect(getByText("Push up")).toBeInTheDocument();
  expect(getByText("Pull up")).toBeInTheDocument();
});
