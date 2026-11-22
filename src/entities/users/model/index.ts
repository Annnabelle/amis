import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { usersApi } from "entities/users/api";
import type { User, UsersState } from "entities/users/types";
import {
  clearAuthStorage,
  getSessionEnd,
  readStoredUser,
  type AuthTokens,
} from "shared/lib/authSession";

const storedUser = readStoredUser<User>();
const storedSessionEnd = getSessionEnd();

/**
 * Сессия пользователя: кто вошёл и с каким токеном. Это состояние
 * приложения, а не серверный кеш, поэтому слайс остался. Сами запросы живут
 * в entities/users/api, а слайс слушает их результаты.
 *
 * access-токен в памяти, поэтому перезагрузка начинается с восстановления
 * сессии по cookie: до его конца вход не подтверждён.
 */
const initialState: UsersState = {
  user: storedUser,
  accessToken: null,
  sessionStart: null,
  isAuthenticated: false,
  isRestoring: storedSessionEnd !== null && storedSessionEnd > Date.now(),
  currentUser: storedUser,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.sessionStart = null;
      state.isAuthenticated = false;
      state.isRestoring = false;
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
    /** Молчаливое продление сессии: пользователь тот же, токен новый. */
    sessionRefreshed: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
    },
    /** Сессия поднята по cookie после перезагрузки страницы. */
    sessionRestored: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.sessionStart = Date.now();
      state.isAuthenticated = true;
      state.isRestoring = false;
    },
    /** Поднять не удалось: cookie нет или она не принята. */
    sessionRestoreFailed: (state) => {
      state.user = null;
      state.currentUser = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isRestoring = false;
      clearAuthStorage();
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
        state.sessionStart = Date.now();
        state.isAuthenticated = true;
        state.isRestoring = false;
      })
      .addMatcher(changeOwnPassword.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.currentUser = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.sessionStart = Date.now();
        state.isAuthenticated = true;
        state.isRestoring = false;
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

export const {
  logout,
  login,
  clearUser,
  sessionRefreshed,
  sessionRestored,
  sessionRestoreFailed,
} = usersSlice.actions;

export default usersSlice.reducer;
