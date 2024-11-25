'use client';

import { createGlobalStore } from 'hox-nextjs';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { setJwtToken } from '../trpc';
import { useLocalStorage } from '../utils/use-localstorage';

export const [useUser] = createGlobalStore(() => {
  const [token, setToken] = useLocalStorage('token', '');
  const hasLogin = useMemo(() => !!token, [token]);
  const jwtUserInfo = useMemo(() => jwtDecode(token), [token]);
  const { userId: uid, type: userType } = jwtUserInfo ?? {};

  useLayoutEffect(() => {
    const handleLogin = async () => {
      if (!hasLogin) {
      }
      if (hasLogin) {
        setJwtToken(token);
      }
    };

    handleLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
