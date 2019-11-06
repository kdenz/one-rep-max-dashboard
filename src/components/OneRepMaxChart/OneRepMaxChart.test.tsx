import React from "react";
import { render } from "@testing-library/react";

import { theme } from "styles/theme";
import { ThemeProvider } from "styled-components";
import { OneRepMaxChart } from "./OneRepMaxChart";

const component = (
  <ThemeProvider theme={theme}>
    <OneRepMaxChart
      highest1RM={235}
      data={[
        { date: `2019-10-15T00:05:32.000Z`, value: 100 },
        { date: `2019-10-18T00:05:32.000Z`, value: 200 }
      ]}
    />
  </ThemeProvider>
);

it("shows the highest 1RM", () => {
  const { getByText } = render(component);
  expect(getByText("235.00")).toBeInTheDocument();
});

// TODO find a way to test recharts, because it seems impossible to test it now
