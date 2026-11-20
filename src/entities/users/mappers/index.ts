import type { UserResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { ChangePasswordDto, CreateUserDto, LoginDto, RegisterUserDto, UpdateUserDto } from '@edem2000/amis.contracts/api/users/requests';
import type { UserPreviewDto } from '@edem2000/amis.contracts/api/users/responses';
import type { ChangePasswordResponseBodyDto, LoginResponseBodyDto } from 'entities/users/dtos';
import type { AddUserForm, AuthSession, ChangePassword, LoginForm, RegisterForm, UserPreview, User } from "entities/users/types";

// PhoneInput emits digits without the leading "+"; the API expects E.164 (+998…)
const toE164Phone = (phone: string): string => {
  const trimmed = phone.trim();
  return trimmed && !trimmed.startsWith("+") ? `+${trimmed}` : trimmed;
};

export function mapLoginFormToLoginDto(form: LoginForm): LoginDto {
  return {
    email: form.email.trim(),
    password: form.password,
  };
}

export function mapChangePwdFormToChangePwdDto(form: ChangePassword): ChangePasswordDto {
  return {
    currentPassword: form.currentPassword,
    newPassword: form.newPassword,
    newPasswordConfirmation: form.newPasswordConfirmation,
  };
}

export const mapUsersDtoToEntity = (dto: UserResponseDto): User => ({
  id: dto.id,
  firstName: dto.firstName,
  lastName: dto.lastName,
  email: dto.email,
  phone: dto.phone,
  pinfl: dto.pinfl,
  status: dto.status,
  preferences: dto.preferences,
  emailVerifiedAt: dto.emailVerifiedAt ? new Date(dto.emailVerifiedAt) : null,
  lastLoggedInAt: dto.lastLoggedInAt ? new Date(dto.lastLoggedInAt) : null,
});

export const mapUserPreviewDtoToEntity = (dto: UserPreviewDto): UserPreview => ({
  id: dto.id,
  firstName: dto.firstName,
  lastName: dto.lastName,
  status: dto.status,
  email: dto.email,
  phone: dto.phone,
});

// admin-created user (POST /users) — no password
export const mapCreateUserFormToDto = (form: AddUserForm): CreateUserDto => ({
  firstName: form.firstName,
  lastName: form.lastName,
  email: form.email.trim().toLowerCase(),
  phone: toE164Phone(form.phone),
  pinfl: form.pinfl || undefined,
});

// public self-registration (POST /auth/register) — with password
export const mapRegisterFormToDto = (form: RegisterForm): RegisterUserDto => ({
  firstName: form.firstName,
  lastName: form.lastName,
  email: form.email.trim().toLowerCase(),
  phone: toE164Phone(form.phone),
  pinfl: form.pinfl || undefined,
  password: form.password,
});

export const mapUpdateUserFormToDto = (form: Partial<User>): UpdateUserDto => {
  return {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email?.trim().toLowerCase(),
    phone: form.phone,
    pinfl: form.pinfl,
    status: form.status,
  };
};


/** Смена пароля отдаёт новые токены: сессию после неё надо переписать. */
export const mapChangePwdDtoToSession = (
  dto: ChangePasswordResponseBodyDto
): AuthSession => ({
  user: mapUsersDtoToEntity(dto.user),
  accessToken: dto.tokens.accessToken,
  sessionEnd: new Date(dto.tokens.refreshExpiresAt).getTime(),
});


export function mapLoginResponseDtoToSession(
  dto: LoginResponseBodyDto
): AuthSession {
  return {
    user: mapUsersDtoToEntity(dto.user),
    accessToken: dto.tokens.accessToken,
    sessionEnd: new Date(dto.tokens.refreshExpiresAt).getTime(),
  };
}

export function mapUpdateUserDtoToEntity(dto: UserResponseDto): User {
  return mapUsersDtoToEntity(dto);
}

