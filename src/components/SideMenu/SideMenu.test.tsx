import React from "react";
import { render } from "@testing-library/react";

import { theme } from "styles/theme";
import { ThemeProvider } from "styled-components";
import { SideMenu, SideMenuProps } from "./SideMenu";

const renderComponent = (props?: SideMenuProps) =>
  render(
    <ThemeProvider theme={theme}>
      <SideMenu noOverlay={true} isOpen={true} {...props}>
        Fitbod is awesome
      </SideMenu>
    </ThemeProvider>
  );

it("renders children when it's opened", () => {
  const { getByText } = renderComponent();
  expect(getByText("Fitbod is awesome")).toBeInTheDocument();
});

jest.mock("hooks/useWindowSize", () => ({
  useWindowSize: () => ({ width: 600, height: 500 })
}));
it("docks itself if screen width > 500", () => {
  const { queryByTestId } = renderComponent();
  expect(queryByTestId("SideMenuOverlay")).toBeFalsy();
});
