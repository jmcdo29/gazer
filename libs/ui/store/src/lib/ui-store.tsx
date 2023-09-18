import { createContext } from 'react';

export interface User {
  id: string;
  refreshToken: string;
  sessionToken: string;
}

export const UserContext = createContext<User>({
  id: '',
  refreshToken: '',
  sessionToken: '',
});
