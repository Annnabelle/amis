import type { ErrorDto } from "shared/types/dtos";
import type { ChangePasswordDto, ChangePasswordResponseDto, LoginDto, LoginResponseDto, RegisterUserDto, UpdateUserDto, UserResponseDto, UserPreviewDto } from "entities/users/dtos/login";
import type { AddUserForm, ChangePassword, ChangePasswordResponse, LoginForm, LoginResponse, UserPreview, UserResponse } from "entities/users/types";
import type { Language } from "shared/types/dtos";

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

const getUserFirstName = (dto: UserResponseDto | UserPreviewDto) => dto.name?.first ?? dto.firstName ?? "";
const getUserLastName = (dto: UserResponseDto | UserPreviewDto) => dto.name?.last ?? dto.lastName ?? "";

export const mapUsersDtoToEntity = (dto: UserResponseDto): UserResponse => ({
  id: dto.id,
  firstName: getUserFirstName(dto),
  lastName: getUserLastName(dto),
  email: dto.email,
  phone: dto.phone,
  status: dto.status,
  companyIds: dto.companyIds ?? [],
  language: dto.language ?? "ru",
  lastLoggedInAt: dto.lastLoggedInAt ? new Date(dto.lastLoggedInAt) : null,
});

export const mapUserPreviewDtoToEntity = (dto: UserPreviewDto): UserPreview => ({
  id: dto.id,
  firstName: getUserFirstName(dto),
  lastName: getUserLastName(dto),
  status: dto.status,
  email: dto.email,
  phone: dto.phone,
});

export const mapRegisterUserFormToDto = (form: AddUserForm & { language: Language }): RegisterUserDto => ({
  firstName: form.firstName,
  lastName: form.lastName,
  email: form.email,
  phone: form.phone,
  password: form.password,
  language: form.language as RegisterUserDto["language"],
});

export const mapUpdateUserFormToDto = (form: Partial<UserResponse>): UpdateUserDto => {
  const dto: UpdateUserDto = {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    phone: form.phone,
    language: form.language as UpdateUserDto["language"],
    status: form.status as UpdateUserDto["status"],
  };

  return dto;
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










