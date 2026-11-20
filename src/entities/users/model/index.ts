import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { usersApi } from "entities/users/api";
import type { User, UsersState } from "entities/users/types";
import { clearAuthStorage, type AuthTokens } from "shared/lib/authSession";

const storedUser = localStorage.getItem("user");
const storedAccessToken = localStorage.getItem("accessToken");
const storedRefreshToken = localStorage.getItem("refreshToken");

/**
 * Сессия пользователя: кто вошёл и с какими токенами. Это состояние
 * приложения, а не серверный кеш, поэтому слайс остался. Сами запросы живут
 * в entities/users/api, а слайс слушает их результаты.
 */
const initialState: UsersState = {
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  accessToken: storedAccessToken,
  refreshToken: storedRefreshToken,
  sessionStart: storedAccessToken ? Date.now() : null,
  isAuthenticated: !!storedAccessToken,
  currentUser: storedUser ? (JSON.parse(storedUser) as User) : null,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.sessionStart = null;
      state.isAuthenticated = false;
      state.currentUser = null;
      clearAuthStorage();
    },
    login: (state) => {
      state.isAuthenticated = true;
      state.sessionStart = Date.now();
    },
    clearUser(state) {
      state.currentUser = null;
    },
    /** Молчаливое продление сессии: пользователь тот же, токены новые. */
    sessionRefreshed: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    const { login, changeOwnPassword, getCurrentUser, updateUserPreferences } =
      usersApi.endpoints;

    builder
      /** Вход и смена своего пароля дают новую сессию. */
      .addMatcher(login.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.currentUser = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.sessionStart = Date.now();
        state.isAuthenticated = true;
      })
      .addMatcher(changeOwnPassword.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.currentUser = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.sessionStart = Date.now();
        state.isAuthenticated = true;
      })
      .addMatcher(getCurrentUser.matchFulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.user = action.payload;
      })
      .addMatcher(updateUserPreferences.matchFulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.user = action.payload;
      });
  },
});

export const { logout, login, clearUser, sessionRefreshed } = usersSlice.actions;

export default usersSlice.reducer;
