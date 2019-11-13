import { OneRepMaxPage } from "pages/OneRepMaxPage";
import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "styles/theme";
import { LoginPage } from "pages/LoginPage";

// Add typing to the theme prop for styled-components
type Theme = typeof theme;
declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}

// ThemeProvider is used to provide consistent color theming for children
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoggedIn ? (
        <OneRepMaxPage />
      ) : (
        <LoginPage onLoginSuccess={onLoginSuccess} />
      )}
    </ThemeProvider>
  );
};

export default App;
