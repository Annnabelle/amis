import type { ErrorDto, HexString, UserPreferences, UserStatus } from "shared/types/dtos";

export type UserResponse = {
    id: HexString,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    pinfl?: string,
    status: UserStatus,
    preferences: UserPreferences,
    emailVerifiedAt: Date | null,
    lastLoggedInAt: Date | null,
}

export type UserPreview = {
    id: HexString,
    firstName: string,
    lastName: string,
    status: string,
    email: string,
    phone: string,
    pinfl?: string,
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
    userById: UserResponse | null;
    userPreviewById: Record<HexString, UserPreview>;
    userPreviewLoadingById: Record<HexString, boolean>;
    updateUser: UserResponse | null;
    searchedUsers: UserResponse[];
    users: UserResponse[];
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    status: string | null;
    sessionStart: number | null;
    isAuthenticated: boolean;
    total: number,
    page: number,
    limit: number,
    currentUser: UserResponse | null,
};

// admin "create user" form — no password, the user sets it via the activation email
export type AddUserForm = {
  firstName: string
  lastName: string,
  phone: string,
  pinfl: string,
  email: string,
}

// public self-registration form
export type RegisterForm = {
  firstName: string;
  lastName: string;
  phone: string;
  pinfl: string;
  email: string;
  password: string;
}


export type ChangePassword= {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export type ChangePasswordQueryDto = {
  id: HexString;
}

export type ChangePasswordResponse = {
  success: boolean,
  user: UserResponse,
  tokens: {
    accessToken: string,
    refreshToken: string,
  }
} | ErrorDto;



