import { createContext } from 'react';

export interface User {
  id: string;
  refreshToken: string;
  sessionToken: string;
  setUser: (user: Omit<User, 'setUser'>) => void;
}

export const UserContext = createContext<User>({
  id: '',
  refreshToken: '',
  sessionToken: '',
  setUser: () => {
    /* no op */
  },
});
