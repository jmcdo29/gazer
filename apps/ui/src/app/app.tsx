import { ThemeProvider } from '@emotion/react';
import { UiRouter } from '@gazer/ui/router';
import { User, UserContext } from '@gazer/ui/store';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';

import { theme } from './theme';

export function App() {
  const [user, setUser] = useState<User>({
    id: '',
    refreshToken: '',
    sessionToken: '',
  });
  const saveUser = (user: User): void => {
    window.sessionStorage.setItem('sessionToken', user.sessionToken);
    window.sessionStorage.setItem('refreshToken', user.refreshToken);
    window.sessionStorage.setItem('userId', user.id);
    setUser({ ...user });
  };
  useEffect(() => {
    const userFromSession = {
      id: sessionStorage.getItem('userId') ?? '',
      sessionToken: sessionStorage.getItem('sessionToken') ?? '',
      refreshToken: sessionStorage.getItem('refreshToken') ?? '',
    };
    if (
      userFromSession.id &&
      userFromSession.sessionToken &&
      userFromSession.refreshToken
    ) {
      setUser(userFromSession);
    }
  }, [setUser]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <UserContext.Provider value={user}>
          <UiRouter setUser={saveUser} />
        </UserContext.Provider>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
