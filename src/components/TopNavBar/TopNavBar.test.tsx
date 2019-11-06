import React from "react";
import { render } from "@testing-library/react";

import { theme } from "styles/theme";
import { ThemeProvider } from "styled-components";
import { TopNavBar, TopNavBarProps } from "./TopNavBar";

const renderComponent = (props: TopNavBarProps) =>
  render(
    <ThemeProvider theme={theme}>
      <TopNavBar {...props} />
    </ThemeProvider>
  );

it("renders title", () => {
  const { getByText } = renderComponent({
    title: "fitbod is cool",
    onMenuClick: jest.fn()
  });
  expect(getByText("fitbod is cool")).toBeInTheDocument();
});

jest.mock("hooks/useWindowSize", () => ({
  useWindowSize: () => ({ width: 200, height: 500 })
}));
it("renders the burger menu icon when screen size is less than 500", () => {
  const { getByTestId } = renderComponent({
    title: "hi",
    onMenuClick: jest.fn()
  });

  expect(getByTestId("BurgerMenuButton")).toBeInTheDocument();
});
