import type { ErrorDto } from "../../dtos";
import type { LoginDto, LoginResponseDto } from "../../dtos/users/login";
import type { LoginForm, LoginResponse } from "../../types/users";

export function mapLoginFormToLoginDto(form: LoginForm): LoginDto {
  return {
    email: form.email.trim(),
    password: form.password,
  };
}

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
        lastLoggedInAt: dto.user.lastLoggedInAt,
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





