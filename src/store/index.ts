import { getRuleDefinitions } from '@/api';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import giftReducer from './giftSlice';
import sampleReducer from './sampleSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    sample: sampleReducer,
    user: userReducer,
    gift: giftReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

// eslint-disable-next-line import/no-mutable-exports
export let rules: Map<string, Map<string, string>> = new Map<
  string,
  Map<string, string>
>();
getRuleDefinitions().then((result) => {
  rules = result.info;
});
