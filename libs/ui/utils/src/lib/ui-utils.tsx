import { User } from '@gazer/ui/store';

import { BASE_URL } from './constants';

const refreshUser = async (user: User) => {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${user.refreshToken}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data);
  }
  user.setUser({
    id: user.id,
    refreshToken: data.refreshToken,
    sessionToken: data.sessionToken,
  });
  return {
    ...user,
    sessionToken: data.sessionToken,
    refreshToken: data.refreshToken,
  };
};

export const postData = async (
  endpoint: string,
  data: Record<string, unknown> | FormData,
  user?: User,
  method: 'POST' | 'PATCH' | 'DELETE' = 'POST',
  isRefresh = false
): Promise<Record<string, unknown>> => {
  const headers: Record<string, string> = {};
  const isFormData = data instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (user?.id) {
    headers.authorization = `Bearer ${user.sessionToken}`;
  }
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method,
    body: isFormData ? data : JSON.stringify(data),
    headers: headers,
  });
  let resData = { data: '' };
  try {
    resData = await res.json();
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    if (res.status === 403 && !isRefresh && user?.id) {
      const newUser = await refreshUser(user);
      return postData(endpoint, data, newUser, method, true);
    }
    throw new Error(JSON.stringify(resData));
  }
  return resData;
};
