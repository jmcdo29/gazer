import { ThemeProvider } from '@emotion/react';
import { UiRouter } from '@gazer/ui/router';
import CssBaseline from '@mui/material/CssBaseline';

import { theme } from './theme';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <UiRouter />
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
