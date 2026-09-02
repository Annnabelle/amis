import type { AddUserForm, ChangePassword, LoginForm, RegisterForm, UserResponse, UsersState } from "entities/users/types";
import type { AccountActionResponseDto, ChangePasswordDto, ChangePasswordResponseDto, DeleteUserDto, DeleteUserResponseDto, ForgotPasswordDto, ForgotPasswordResponseDto, GetUserDto, GetUserPreviewResponseDto, GetUserResponseDto, GetUsersDto, GetUsersResponseDto, LoginResponseDto, ResetPasswordDto, ResetPasswordResponseDto, SetPasswordDto, UpdateUserResponseDto, UserPreviewDto, UserResponseDto, VerifyEmailDto } from "entities/users/dtos/login";
import type { PaginatedResponseDto } from "shared/types/dtos";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UpdateUserPreferencesDto, UpdateUserPreferencesResponseDto } from "entities/users/dtos/login";
import { isAccountActionSuccess, mapChangePwdDtoToEntity, mapChangePwdFormToChangePwdDto, mapCreateUserFormToDto, mapLoginFormToLoginDto, mapLoginResponseDtoToLoginResponse, mapRegisterFormToDto, mapUpdateUserDtoToEntity, mapUpdateUserFormToDto, mapUserPreviewDtoToEntity, mapUsersDtoToEntity } from "entities/users/mappers";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import { clearAuthStorage } from "shared/lib/authSession";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";

export type AccountActionError = { message: string };

const toAccountActionError = (data: unknown, fallback: string): AccountActionError => ({
  message: getBackendErrorMessage(data, fallback),
});

const storedUser = localStorage.getItem("user");
const storedAccessToken = localStorage.getItem("accessToken");
const storedRefreshToken = localStorage.getItem("refreshToken");

const initialState: UsersState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  userById: null,
  userPreviewById: {},
  userPreviewLoadingById: {},
  updateUser: null,
  users: [],
  searchedUsers: [],
  total: 0,
  page: 1,
  limit: 10,
  accessToken: storedAccessToken,
  refreshToken: storedRefreshToken,
  isLoading: false,
  error: null,
  status: null,
  sessionStart: storedAccessToken ? Date.now() : null,
  isAuthenticated: !!storedAccessToken,
  currentUser: storedUser ? JSON.parse(storedUser) : null,
};

export const Login = createAsyncThunk(
    'users/login',
    async (data: LoginForm, { rejectWithValue }) => {
      try {
        const dto = mapLoginFormToLoginDto(data);
        const response = await axiosInstance.post<LoginResponseDto>(`${BASE_URL}/auth/login`, dto);

        const mapped = mapLoginResponseDtoToLoginResponse(response.data);

        if (mapped.success && mapped.user) {
          localStorage.setItem('accessToken', mapped.accessToken!);
          localStorage.setItem('refreshToken', mapped.refreshToken!);
          localStorage.setItem('user', JSON.stringify(mapped.user));

          return mapped;
        } else {
          return rejectWithValue(getBackendErrorMessage(mapped.error, 'Ошибка авторизации'));
        }
      } catch (error: any) {
        return rejectWithValue(getBackendErrorMessage(error.response?.data ?? error, 'Ошибка сервера'));
      }
    }
);

function isSuccessResponse(res: GetUsersResponseDto): res is { success: boolean } & PaginatedResponseDto<UserResponseDto> {
  return "success" in res && res.success === true;
}

export const getAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async (params: GetUsersDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetUsersResponseDto>(`${BASE_URL}/users`, {
        params,
      });
      if (isSuccessResponse(response.data)) {
        return {
          data: response.data.data.map(mapUsersDtoToEntity),
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        };
      }
      return rejectWithValue(
        getBackendErrorMessage(response.data, "Ошибка загрузки пользователей")
      );
    } catch (err: any) {
      return rejectWithValue(getBackendErrorMessage(err.response?.data ?? err, "Ошибка сервера"));
    }
  }
);



function isSuccessChangePasswordResponseDto(
  res: ChangePasswordResponseDto
): res is { success: boolean; user: UserResponseDto, tokens: { accessToken: string; refreshToken: string } } {
  return "success" in res && res.success === true && "user" in res;
}

export const changeUserPassword = createAsyncThunk(
  'users/changeUserPassword',
  async ( { userId, data }: { userId: string; data: ChangePasswordDto },
    thunkAPI) => {
    try {
      const response = await axiosInstance.patch<ChangePasswordResponseDto>(`${BASE_URL}/users/${userId}/change-password`, data);
      if (isSuccessChangePasswordResponseDto(response.data)) {
        return mapChangePwdDtoToEntity(response.data);
      }
      return thunkAPI.rejectWithValue(
        getBackendErrorMessage(response.data, "Ошибка изменения пароля")
      );
    } catch (err: any) {
      return thunkAPI.rejectWithValue(getBackendErrorMessage(err.response?.data ?? err, "Ошибка сервера"));
    }
  }
)

// admin creates a user (POST /users) — no password; backend emails an activation link
export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload: AddUserForm, { rejectWithValue }) => {
    try {
      const dto = mapCreateUserFormToDto(payload);
      const response = await axiosInstance.post<AccountActionResponseDto>(
        `${BASE_URL}/users`,
        dto
      );

      if (isAccountActionSuccess(response.data)) {
        return mapUsersDtoToEntity(response.data.user);
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Ошибка создания пользователя")
      );
    } catch (err: any) {
      return rejectWithValue(
        getBackendErrorMessage(err.response?.data ?? err, "Ошибка сервера")
      );
    }
  }
);

// public self-registration (POST /auth/register)
export const registerAccount = createAsyncThunk(
  "users/registerAccount",
  async (payload: RegisterForm, { rejectWithValue }) => {
    try {
      const dto = mapRegisterFormToDto(payload);
      const response = await axiosInstance.post<AccountActionResponseDto>(
        `${BASE_URL}/auth/register`,
        dto
      );

      if (isAccountActionSuccess(response.data)) {
        return mapUsersDtoToEntity(response.data.user);
      }

      return rejectWithValue(toAccountActionError(response.data, "Ошибка регистрации"));
    } catch (err: any) {
      return rejectWithValue(
        toAccountActionError(err.response?.data ?? err, "Ошибка сервера")
      );
    }
  }
);

// confirm email after self-registration (POST /auth/verify-email)
export const verifyEmail = createAsyncThunk(
  "users/verifyEmail",
  async (payload: VerifyEmailDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<AccountActionResponseDto>(
        `${BASE_URL}/auth/verify-email`,
        payload
      );

      if (isAccountActionSuccess(response.data)) {
        return mapUsersDtoToEntity(response.data.user);
      }

      return rejectWithValue(
        toAccountActionError(response.data, "Ошибка подтверждения email")
      );
    } catch (err: any) {
      return rejectWithValue(
        toAccountActionError(err.response?.data ?? err, "Ошибка сервера")
      );
    }
  }
);

// activate account / set password (POST /auth/set-password)
export const setPassword = createAsyncThunk(
  "users/setPassword",
  async (payload: SetPasswordDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<AccountActionResponseDto>(
        `${BASE_URL}/auth/set-password`,
        payload
      );

      if (isAccountActionSuccess(response.data)) {
        return mapUsersDtoToEntity(response.data.user);
      }

      return rejectWithValue(
        toAccountActionError(response.data, "Ошибка активации аккаунта")
      );
    } catch (err: any) {
      return rejectWithValue(
        toAccountActionError(err.response?.data ?? err, "Ошибка сервера")
      );
    }
  }
);

function isGetUserSuccessResponse(
  res: GetUserResponseDto
): res is { success: boolean; user: UserResponseDto } {
  return "success" in res && res.success === true && "user" in res;
}

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (params: GetUserDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetUserResponseDto>(
        `${BASE_URL}/users/${params.id}`
      );

      if (isGetUserSuccessResponse(response.data)) {
        return mapUsersDtoToEntity(response.data.user);
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Ошибка загрузки пользователя")
      );
    } catch (err: any) {
      return rejectWithValue(getBackendErrorMessage(err.response?.data ?? err, "Ошибка сервера"));
    }
  }
);

function isGetUserPreviewSuccessResponse(
  res: GetUserPreviewResponseDto
): res is { success: boolean; data: UserPreviewDto } {
  return "success" in res && res.success === true && "data" in res;
}

export const getUserPreview = createAsyncThunk(
  "users/getUserPreview",
  async (params: GetUserDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetUserPreviewResponseDto>(
        `${BASE_URL}/users/${params.id}/preview`
      );

      if (isGetUserPreviewSuccessResponse(response.data)) {
        return mapUserPreviewDtoToEntity(response.data.data);
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Ошибка загрузки превью пользователя")
      );
    } catch (err: any) {
      return rejectWithValue(getBackendErrorMessage(err.response?.data ?? err, "Ошибка сервера"));
    }
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as { users: UsersState };
      const usersState = state.users;

      return !(
        usersState.userPreviewById[params.id] ||
        usersState.userPreviewLoadingById[params.id]
      );
    },
  }
);

function isUpdateUserSuccessResponse(
  res: UpdateUserResponseDto
): res is { success: boolean; user: UserResponseDto } {
  return "success" in res && res.success === true && "user" in res;
}

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }: { id: string; data: Partial<UserResponse> }, { rejectWithValue }) => {
    try {
      const dto = mapUpdateUserFormToDto(data);
      const response = await axiosInstance.patch<UpdateUserResponseDto>(
        `${BASE_URL}/users/${id}`,
        dto
      );

      if (isUpdateUserSuccessResponse(response.data)) {
        return mapUpdateUserDtoToEntity(response.data.user);
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Ошибка обновления пользователя")
      );
    } catch (err: any) {
      return rejectWithValue(
        getBackendErrorMessage(err.response?.data ?? err, "Ошибка сервера")
      );
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  "users/updateUserPreferences",
  async (preferences: UpdateUserPreferencesDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<UpdateUserPreferencesResponseDto>(
        `${BASE_URL}/users/me/preferences`,
        preferences
      );

      return mapUsersDtoToEntity(response.data.user);
    } catch (err: any) {
      return rejectWithValue(
        getBackendErrorMessage(err.response?.data ?? err, "Ошибка обновления настроек пользователя")
      );
    }
  },
  {
    // skip when not logged in (e.g. theme toggle on the login screen)
    condition: (_preferences, { getState }) => {
      const { users } = getState() as { users: UsersState };
      return users.isAuthenticated && Boolean(users.accessToken);
    },
  }
);

// GET /users/me
export const fetchCurrentUser = createAsyncThunk(
  "users/fetchCurrentUser",
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetUserResponseDto>(`${BASE_URL}/users/me`);

      if (isGetUserSuccessResponse(response.data)) {
        return mapUsersDtoToEntity(response.data.user);
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Ошибка загрузки профиля")
      );
    } catch (err: any) {
      return rejectWithValue(
        getBackendErrorMessage(err.response?.data ?? err, "Ошибка сервера")
      );
    }
  }
);

// PATCH /users/me/password, returns fresh tokens
export const changeOwnPassword = createAsyncThunk(
  "users/changeOwnPassword",
  async (form: ChangePassword, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<ChangePasswordResponseDto>(
        `${BASE_URL}/users/me/password`,
        mapChangePwdFormToChangePwdDto(form)
      );

      const mapped = mapChangePwdDtoToEntity(response.data);
      if ("tokens" in mapped) {
        localStorage.setItem("accessToken", mapped.tokens.accessToken);
        localStorage.setItem("refreshToken", mapped.tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(mapped.user));
        return mapped;
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Ошибка изменения пароля")
      );
    } catch (err: any) {
      return rejectWithValue(
        getBackendErrorMessage(err.response?.data ?? err, "Ошибка сервера")
      );
    }
  }
);

// POST /auth/forgot-password
export const forgotPassword = createAsyncThunk(
  "users/forgotPassword",
  async (payload: ForgotPasswordDto, { rejectWithValue }) => {
    try {
      await axiosInstance.post<ForgotPasswordResponseDto>(`${BASE_URL}/auth/forgot-password`, {
        email: payload.email.trim().toLowerCase(),
      });

      return true;
    } catch (err: any) {
      return rejectWithValue(
        toAccountActionError(err.response?.data ?? err, "Ошибка сервера")
      );
    }
  }
);

// POST /auth/reset-password
export const resetPassword = createAsyncThunk(
  "users/resetPassword",
  async (payload: ResetPasswordDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ResetPasswordResponseDto>(
        `${BASE_URL}/auth/reset-password`,
        payload
      );

      if (isAccountActionSuccess(response.data)) {
        return mapUsersDtoToEntity(response.data.user);
      }

      return rejectWithValue(
        toAccountActionError(response.data, "Ошибка сброса пароля")
      );
    } catch (err: any) {
      return rejectWithValue(
        toAccountActionError(err.response?.data ?? err, "Ошибка сервера")
      );
    }
  }
);

function isDeleteUserSuccessResponse(
  res: DeleteUserResponseDto
): res is { success: boolean } {
  return "success" in res && res.success === true;
}

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async ({ id }: DeleteUserDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<DeleteUserResponseDto>(
        `${BASE_URL}/users/${id}`
      );

      if (isDeleteUserSuccessResponse(response.data)) {
        return { id };
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Ошибка при удалении пользователя")
      );
    } catch (err: any) {
      return rejectWithValue(
        getBackendErrorMessage(err.response?.data ?? err, "Ошибка сервера")
      );
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/search',
  async (
    { query, page = 1, limit = 10, sortOrder = 'asc' }: {
      query: string;
      page?: number;
      limit?: number;
      sortOrder?: 'asc' | 'desc';
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(`/users/search`, {
        params: { query, page, limit, sortOrder }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(getBackendErrorMessage(error.response?.data ?? error, "Ошибка поиска пользователей"));
    }
  }
);


export const usersSlice = createSlice({ 
  name: 'users',
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
    clearUserById: (state) => {
       state.userById = null;
    },
    clearUser(state) {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        const { user, accessToken } = action.payload;
        if (!user || !accessToken) {
          state.isAuthenticated = false;
          return;
        }

        state.user = user;
        state.currentUser = user;
        state.accessToken = accessToken;
        state.sessionStart = Date.now();
        state.isAuthenticated = true;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);

        const SESSION_DURATION = 60 * 60 * 1000; // 1 час
        const sessionEnd = Date.now() + SESSION_DURATION;
        localStorage.setItem("sessionEnd", String(sessionEnd));
      })
      .addCase(Login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAllUsers.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: UserResponse[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.isLoading = false;
          state.users = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAccount.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as AccountActionError | undefined)?.message ?? null;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as AccountActionError | undefined)?.message ?? null;
      })
      .addCase(setPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(setPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as AccountActionError | undefined)?.message ?? null;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.currentUser = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(changeOwnPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeOwnPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        if ("tokens" in action.payload) {
          state.user = action.payload.user;
          state.currentUser = action.payload.user;
          state.accessToken = action.payload.tokens.accessToken;
          state.refreshToken = action.payload.tokens.refreshToken;
          state.sessionStart = Date.now();
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("sessionEnd", String(Date.now() + 60 * 60 * 1000));
        }
      })
      .addCase(changeOwnPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as AccountActionError | undefined)?.message ?? null;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as AccountActionError | undefined)?.message ?? null;
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userById = action.payload;
      })

      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserPreview.pending, (state, action) => {
        state.isLoading = true;
        state.userPreviewLoadingById[action.meta.arg.id] = true;
        state.error = null;
      })
      .addCase(getUserPreview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.userPreviewById[action.payload.id] = action.payload;
          delete state.userPreviewLoadingById[action.payload.id];
        }
      })
      .addCase(getUserPreview.rejected, (state, action) => {
        state.isLoading = false;
        delete state.userPreviewLoadingById[action.meta.arg.id];
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.isLoading = false;

        if (state.updateUser?.id === action.payload.id) {
          state.updateUser = action.payload;
        }

        state.users = state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.user = action.payload;
        state.currentUser = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.isLoading = false;
        state.users = state.users.filter((u) => u.id !== action.payload.id); // удаляем из списка
        if (state.userById?.id === action.payload.id) {
          state.userById = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        const { data = [] } = action.payload;

        state.searchedUsers = data.map(mapUsersDtoToEntity);
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        if ("user" in action.payload) {
          state.userById = action.payload.user;
        }
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, login } = usersSlice.actions;
export const { clearUserById, clearUser } = usersSlice.actions;
export default usersSlice.reducer;



