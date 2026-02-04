import type { LoginForm, UserResponse, UsersState } from "entities/users/types";
import type { ChangePasswordDto, ChangePasswordResponseDto, DeleteUserDto, DeleteUserResponseDto, GetUserDto, GetUserResponseDto, GetUsersDto, GetUsersResponseDto, LoginResponseDto, RegisterResponseDto, RegisterUserDto, UpdateUserDto, UpdateUserResponseDto, UserResponseDto } from "entities/users/dtos/login";
import type { PaginatedResponseDto } from "shared/types/dtos";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mapChangePwdDtoToEntity, mapLoginFormToLoginDto, mapLoginResponseDtoToLoginResponse, mapUpdateUserDtoToEntity, mapUsersDtoToEntity } from "entities/users/mappers";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";

const storedUser = localStorage.getItem("user");
const storedAccessToken = localStorage.getItem("accessToken");
const storedRefreshToken = localStorage.getItem("refreshToken");

const initialState: UsersState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  userById: null,
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
        const response = await axiosInstance.post<LoginResponseDto>(`${BASE_URL}/users/login`, dto);

        const mapped = mapLoginResponseDtoToLoginResponse(response.data);

        if (mapped.success && mapped.user) {
          console.log("[LOGIN THUNK] Успешный ответ сервера → сохраняем в LS");
          localStorage.setItem('accessToken', mapped.accessToken!);
          localStorage.setItem('refreshToken', mapped.refreshToken!);
          localStorage.setItem('user', JSON.stringify(mapped.user));
          // ... остальные setItem

          console.log("[LOGIN THUNK] Токен сохранён:", mapped.accessToken?.slice(0, 15) + "...");
          console.log("[LOGIN THUNK] User сохранён:", mapped.user.email);

          // ← здесь уже можно принудительно посмотреть состояние
          // но лучше смотреть после .unwrap()

          return mapped;
        } else {
          return rejectWithValue(mapped.error?.errorMessage?.ru || 'Ошибка авторизации');
        }
      } catch (error: any) {
        console.error("[LOGIN THUNK] Ошибка:", error);
        return rejectWithValue(error.response?.data?.message || 'Ошибка сервера');
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
      return rejectWithValue("Ошибка загрузки пользователей");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
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
      return thunkAPI.rejectWithValue("Ошибка изменения пароля");
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Ошибка сервера");
    }
  }
)

function isRegisterSuccessResponse(
  res: RegisterResponseDto
): res is { success: boolean; user: UserResponseDto } {
  return "success" in res && res.success === true && "user" in res;
}

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (payload: RegisterUserDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<RegisterResponseDto>(
        `${BASE_URL}/users/register`,
        payload
      );

      if (isRegisterSuccessResponse(response.data)) {
        return mapUsersDtoToEntity(response.data.user);
      }

      return rejectWithValue("Ошибка регистрации пользователя");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
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

      return rejectWithValue("Ошибка загрузки пользователя");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);

function isUpdateUserSuccessResponse(
  res: UpdateUserResponseDto
): res is { success: boolean; user: UserResponseDto } {
  return "success" in res && res.success === true && "user" in res;
}

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }: { id: string; data: UpdateUserDto }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<UpdateUserResponseDto>(
        `${BASE_URL}/users/${id}`,
        data
      );

      if (isUpdateUserSuccessResponse(response.data)) {
        return mapUpdateUserDtoToEntity(response.data.user);
      }

      return rejectWithValue("Ошибка обновления пользователя");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
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
        return { id }; // вернём только id, чтобы удалить из state
      }

      return rejectWithValue("Ошибка при удалении пользователя");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);

export const searchUsers = createAsyncThunk(
  'users/search',
  async ({ query, page = 1, limit = 10, sortOrder = 'asc' }: { query: string; page?: number; limit?: number; sortOrder?: 'asc' | 'desc' }) => {
    const response = await axiosInstance.get(`/users/search`, {
      params: { query, page, limit, sortOrder }
    });
    return response.data;
  }
);


export const assignUserToCompany = createAsyncThunk(
  "users/assignUserToCompany",
  async (
    { userId, companyId }: { userId: string; companyId: string },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}/companies/assign`, {
        companyId,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error assigning user"
      );
    }
  }
);

export const unassignUserToCompany = createAsyncThunk(
  "users/unassignUserToCompany",
  async (
    { userId, companyId }: { userId: string; companyId: string },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}/companies/unassign `, {
        companyId,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error unassign user"
      );
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
      localStorage.removeItem("userName");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("sessionEnd");
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
      .addCase(assignUserToCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignUserToCompany.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(assignUserToCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(unassignUserToCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unassignUserToCompany.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(unassignUserToCompany.rejected, (state, action) => {
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
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.isLoading = false;
        state.users.push(action.payload); // добавляем нового юзера
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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

        state.searchedUsers = data.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
        }));
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



