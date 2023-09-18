import { ThemeProvider } from '@emotion/react';
import { UiRouter } from '@gazer/ui/router';
import { UserContext } from '@gazer/ui/store';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';

import { theme } from './theme';

export function App() {
  const [user, setUser] = useState<Record<string, string>>({});
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <UserContext.Provider value={user}>
          <UiRouter setUser={setUser} />
        </UserContext.Provider>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
