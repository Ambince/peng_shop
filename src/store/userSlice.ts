import type { RootState } from '@/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AccessTokenResult = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: null;
  token_type: string;
  user_id: string;
};

export const getAccessToken = async (code: string) => {
  const res = await window.fetch(
    `${import.meta.env.VITE_APP_AUTH_URL}/oauth2/login`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    },
  );
  const result: AccessTokenResult = await res.json();
  return result;
};

export type SearchParams = {
  code: string;
  locale: string;
  userState: string;
};

interface UserState {
  userInfo: any;
  loginRedirectSearchParams?: string;
}

const initialState: UserState = {
  userInfo: undefined,
  loginRedirectSearchParams: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userInfo: any }>) => {
      const { payload } = action;
      state.userInfo = payload.userInfo;
    },
    setLoginRedirectSearchParams: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      state.loginRedirectSearchParams = payload;
    },
  },
});

export const { setUser, setLoginRedirectSearchParams } = userSlice.actions;

export const userInfo = (state: RootState) => state.user.userInfo;

export default userSlice.reducer;
