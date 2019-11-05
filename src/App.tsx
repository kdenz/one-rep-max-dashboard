import "./App.css";

import { OneRepMaxPage } from "pages/OneRepMaxPage";
import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "styles/theme";

// Add typing to the theme prop for styled-components
type Theme = typeof theme;
declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <OneRepMaxPage />
    </ThemeProvider>
  );
};

export default App;
