import type { LoginForm, UserResponse, UsersState } from "../../types/users";
import type { DeleteUserDto, DeleteUserResponseDto, GetUserDto, GetUserResponseDto, GetUsersDto, GetUsersResponseDto, LoginResponseDto, RegisterResponseDto, RegisterUserDto, UpdateUserDto, UpdateUserResponseDto, UserResponseDto } from "../../dtos/users/login";
import type { PaginatedResponseDto } from "../../dtos";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mapLoginFormToLoginDto, mapLoginResponseDtoToLoginResponse, mapUpdateUserDtoToEntity, mapUsersDtoToEntity } from "../../mappers/users";
import { BASE_URL } from "../../utils/consts";
import axiosInstance from "../../utils/axiosInstance";

const initialState: UsersState = {
  user: null,
  userById: null,
  updateUser: null,
  users: [],
  total: 0,
  page: 1,
  limit: 10,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  status: null,
  sessionStart: null,
  isAuthenticated: false 
};

export const Login = createAsyncThunk(
  'users/login',
  async (data: LoginForm, { rejectWithValue }) => {
    try {
      const dto = mapLoginFormToLoginDto(data);
      const response = await axiosInstance.post<LoginResponseDto>(`${BASE_URL}/users/login`, dto);

      const mapped = mapLoginResponseDtoToLoginResponse(response.data);

      if (mapped.success && mapped.user) {
        localStorage.setItem('accessToken', mapped.accessToken!);
        localStorage.setItem('refreshToken', mapped.refreshToken!);
        localStorage.setItem('userName', mapped.user.firstName);
        localStorage.setItem('userRole', mapped.user.role?.name.en || '');
        localStorage.setItem("userId", mapped.user.id);

        return mapped;
      } else {
        return rejectWithValue(mapped.error?.errorMessage?.ru || 'Ошибка авторизации');
      }
    } catch (error: any) {
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




export const usersSlice = createSlice({ 
  name: 'users',
  initialState,
  reducers: {
    logout: (state) => {
      state.sessionStart = Date.now();
      state.isAuthenticated = false;
    },
    login: (state) => {
        state.isAuthenticated = true;
        state.sessionStart = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user!;
        state.accessToken = action.payload.accessToken!;
        state.refreshToken = action.payload.refreshToken!;
        state.sessionStart = Date.now();
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
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.isLoading = false;
        state.userById = action.payload; // сохраняем юзера в state
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
        const { data = [], total, page, limit } = action.payload;

        state.users = data.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          lastLoggedInAt: user.lastLoggedInAt,
        }));

        state.total = total;
        state.page = page;
        state.limit = limit;
      });


  },
});

export const { logout, login } = usersSlice.actions;
export default usersSlice.reducer;