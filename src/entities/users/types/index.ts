import type { ChangePasswordQueryDto } from '@edem2000/amis.contracts/api/users/requests';
import type { ErrorDto, HexString, UserPreferences, UserStatus } from "shared/types/dtos";

export type User = {
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

export type LoginResult = {
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  error?: ErrorDto;
};

export type UsersState = {
    user: User | null;
    userById: User | null;
    userPreviewById: Record<HexString, UserPreview>;
    userPreviewLoadingById: Record<HexString, boolean>;
    updateUser: User | null;
    searchedUsers: User[];
    users: User[];
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
    currentUser: User | null,
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


export type { ChangePasswordQueryDto };

export type ChangePasswordResult = {
  success: boolean,
  user: User,
  tokens: {
    accessToken: string,
    refreshToken: string,
  }
} | ErrorDto;


