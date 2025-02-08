'use client';

import { createGlobalStore } from 'hox-nextjs';
import { useCallback, useEffect, useMemo } from 'react';
import { setJwtToken } from '../trpc';
import { useLocalStorage } from '../utils/use-localstorage';

export const [useUser] = createGlobalStore(() => {
  const [token, setToken] = useLocalStorage('token', '');
  const hasLogin = useMemo(() => !!token, [token]);
  const jwtUserInfo = useMemo(() => jwtDecode(token), [token]);
  const { userId: uid, type: userType } = jwtUserInfo ?? {};

  useEffect(() => {
    if (hasLogin) {
      setJwtToken(token);
    }
  }, [hasLogin, token]);

  const logout = useCallback(async () => {
    setToken('');
  }, [setToken]);

  return {
    token,
    setToken,
    hasLogin,
    uid,
    userType,
    logout,
  };
});

function jwtDecode(token: string | undefined):
  | {
      userId: string;
      type: string;
    }
  | undefined {
  if (!token) return undefined;
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) return undefined;
  const payloadJson = JSON.parse(atob(payload));
  return {
    userId: payloadJson.userId,
    type: payloadJson.type,
  };
}
