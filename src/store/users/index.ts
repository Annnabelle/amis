import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/consts";
import type { LoginForm, UsersState } from "../../types/users";
import { mapLoginFormToLoginDto, mapLoginResponseDtoToLoginResponse } from "../../mappers/users";
import type { LoginResponseDto } from "../../dtos/users/login";
import axios from "axios";

export const Login = createAsyncThunk(
  'users/login',
  async (data: LoginForm, { rejectWithValue }) => {
    try {
      const dto = mapLoginFormToLoginDto(data);
      const response = await axios.post<LoginResponseDto>(`${BASE_URL}/users/login`, dto);

      const mapped = mapLoginResponseDtoToLoginResponse(response.data);

      if (mapped.success && mapped.user) {
        localStorage.setItem('accessToken', mapped.accessToken!);
        localStorage.setItem('refreshToken', mapped.refreshToken!);
        localStorage.setItem('userName', mapped.user.firstName);
        localStorage.setItem('userRole', mapped.user.role?.name.en || '');

        return mapped;
      } else {
        return rejectWithValue(mapped.error?.errorMessage?.ru || 'Ошибка авторизации');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка сервера');
    }
  }
);

const initialState: UsersState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  status: null,
  sessionStart: null,
  isAuthenticated: false 
};

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
  },
});

export const { logout, login } = usersSlice.actions;
export default usersSlice.reducer;