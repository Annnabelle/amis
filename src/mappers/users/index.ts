import type { ErrorDto } from "../../dtos";
import type { ChangePasswordDto, ChangePasswordResponseDto, LoginDto, LoginResponseDto, UserResponseDto } from "../../dtos/users/login";
import type { ChangePassword, ChangePasswordResponse, LoginForm, LoginResponse, UserResponse } from "../../types/users";

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
  status: dto.status,
  companyIds: dto.companyIds,
  role: dto.role
    ? {
        id: dto.role.id,
        name: {
          ru: dto.role.name.ru,
          uz: dto.role.name.uz,
          en: dto.role.name.en,
        },
        alias: dto.role.alias,
      }
    : undefined,
  language: dto.language,
  lastLoggedInAt: dto.lastLoggedInAt ? new Date(dto.lastLoggedInAt) : null,
});


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
      user: {
        id: dto.user.id,
        firstName: dto.user.firstName,
        lastName: dto.user.lastName,
        email: dto.user.email,
        phone: dto.user.phone,
        status: dto.user.status,
        companyIds: dto.user.companyIds,
        role: dto.user.role
          ? {
              id: dto.user.role.id,
              name: {
                ru: dto.user.role.name.ru,
                uz: dto.user.role.name.uz,
                en: dto.user.role.name.en,
              },
              alias: dto.user.role.alias,
            }
          : undefined,
        language: dto.user.language,
        lastLoggedInAt: dto.user.lastLoggedInAt ? new Date(dto.user.lastLoggedInAt) : null,
      },
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
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    phone: dto.phone,
    status: dto.status,
    companyIds: dto.companyIds,
    role: dto.role
      ? {
          id: dto.role.id,
          name: dto.role.name,
          alias: dto.role.alias,
        }
      : undefined,
    language: dto.language,
    lastLoggedInAt: dto.lastLoggedInAt ? new Date(dto.lastLoggedInAt) : null,
  };
}






