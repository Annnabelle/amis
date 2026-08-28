import type { ErrorDto } from "shared/types/dtos";
import type { ChangePasswordDto, ChangePasswordResponseDto, LoginDto, LoginResponseDto, RegisterUserDto, UpdateUserDto, UserResponseDto, UserPreviewDto } from "entities/users/dtos/login";
import type { AddUserForm, ChangePassword, ChangePasswordResponse, LoginForm, LoginResponse, UserPreview, UserResponse } from "entities/users/types";

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

export const mapUsersDtoToEntity = (dto: UserResponseDto): UserResponse => ({
  id: dto.id,
  firstName: dto.firstName,
  lastName: dto.lastName,
  email: dto.email,
  phone: dto.phone,
  pinfl: dto.pinfl,
  status: dto.status,
  preferences: dto.preferences,
  lastLoggedInAt: dto.lastLoggedInAt ? new Date(dto.lastLoggedInAt) : null,
});

export const mapUserPreviewDtoToEntity = (dto: UserPreviewDto): UserPreview => ({
  id: dto.id,
  firstName: dto.name?.first ?? dto.firstName ?? "",
  lastName: dto.name?.last ?? dto.lastName ?? "",
  status: dto.status,
  email: dto.email,
  phone: dto.phone,
  pinfl: dto.pinfl,
});

export const mapRegisterUserFormToDto = (form: AddUserForm): RegisterUserDto => ({
  firstName: form.firstName,
  lastName: form.lastName,
  email: form.email.trim().toLowerCase(),
  phone: form.phone,
  pinfl: form.pinfl,
  password: form.password,
});

export const mapUpdateUserFormToDto = (form: Partial<UserResponse>): UpdateUserDto => {
  return {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email?.trim().toLowerCase(),
    phone: form.phone,
    pinfl: form.pinfl,
    status: form.status,
  };
};


function isSuccessChangePasswordResponseDto(
  dto: ChangePasswordResponseDto
): dto is Exclude<ChangePasswordResponseDto, ErrorDto> {
  return (dto as any).success !== undefined;
}

export const mapChangePwdDtoToEntity = (
  dto: ChangePasswordResponseDto
): ChangePasswordResponse => {
  if (isSuccessChangePasswordResponseDto(dto)) {
    return {
      success: dto.success,
      user: mapUsersDtoToEntity(dto.user),
      tokens: {
        accessToken: dto.tokens.accessToken,
        refreshToken: dto.tokens.refreshToken,
      },
    };
  }

  return dto;
};



function isSuccessLoginResponseDto(dto: LoginResponseDto
): dto is Exclude<LoginResponseDto, ErrorDto> {
  return "user" in dto;
}

export function mapLoginResponseDtoToLoginResponse(
  dto: LoginResponseDto
): LoginResponse {
  if (isSuccessLoginResponseDto(dto) && dto.success) {
    return {
      success: true,
      user: mapUsersDtoToEntity(dto.user),
      accessToken: dto.tokens.accessToken,
      refreshToken: dto.tokens.refreshToken,
    };
  }

  return {
    success: false,
    error: dto as ErrorDto,
  };
}

export function mapUpdateUserDtoToEntity(dto: UserResponseDto): UserResponse {
  return mapUsersDtoToEntity(dto);
}










