import type { ErrorDto, HexString } from "../../dtos";

export type UserResponse = {
    id: HexString,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    status: string,
    role?: {
    id: HexString,
    name: {
        ru: string,
        uz: string,
        en: string,
    },
    alias: string,
    },
    language: string,
    lastLoggedInAt: Date | null,
}

export type LoginForm = {
  email: string;
  password: string;
}

export type LoginResponse = {
  success: boolean;
  user?: UserResponse;
  accessToken?: string;
  refreshToken?: string;
  error?: ErrorDto;
};


export type UsersState = {
    user: UserResponse | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    status: string | null;
    sessionStart: number | null;
    isAuthenticated: boolean;
};