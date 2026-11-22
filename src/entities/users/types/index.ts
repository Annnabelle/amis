import type { ChangePasswordQueryDto } from '@edem2000/amis.contracts/api/users/requests';
import type { HexString, UserPreferences, UserStatus } from "shared/types/dtos";
import type { Paginated } from "shared/api";

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

/**
 * Вход и смена своего пароля отдают одно и то же: пользователя, access-токен
 * и конец сессии. refresh-токен клиенту не виден — он в httpOnly-cookie.
 */
export type AuthSession = {
  user: User;
  accessToken: string;
  sessionEnd: number;
};

export type UserList = Paginated<User>;

/** Сессия на экране: пользователь, токен в памяти и признак входа. */
export type UsersState = {
    accessToken: string | null;
    sessionStart: number | null;
    isAuthenticated: boolean;
    /** Идёт восстановление сессии по cookie: роутер ждёт и никуда не уводит. */
    isRestoring: boolean;
    currentUser: User | null;
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




