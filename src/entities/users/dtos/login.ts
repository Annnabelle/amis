import type { ErrorDto, HexString, Language, PaginatedDto, PaginatedResponseDto, UserSortField, UserStatus } from "shared/types/dtos";

export type LoginDto = {
  email: string;
  password: string;
}

export type UserNameDto = {
  first: string;
  last: string;
}

export type UserResponseDto = {
  id: HexString,
  name?: UserNameDto,
  firstName?: string,
  lastName?: string,
  email: string,
  phone: string,
  pinfl?: string,
  status: string,
  companyIds?: HexString[],
  language?: string,
  lastLoggedInAt?: string | Date | null,
};

export type LoginResponseDto = {
  success: boolean,
  user: UserResponseDto,
  tokens: {
    accessToken: string,
    refreshToken: string,
  }
} | ErrorDto;

export type GetUsersDto = PaginatedDto & {
  status?: UserStatus;
  search?: string;
  sortBy?: UserSortField;
}

export type GetUsersResponseDto = ({
  success: boolean,
} & PaginatedResponseDto<UserResponseDto>)| ErrorDto;

export type RegisterUserDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pinfl?: string;
  password: string;
  language: Language;
}

export type RegisterResponseDto = {
  success: boolean,
  user: UserResponseDto,
} | ErrorDto;

export type GetUserDto = {
  id: HexString;
}

export type GetUserResponseDto = {
  success: boolean,
  user: UserResponseDto,
} | ErrorDto;

export type UserPreviewDto = {
  id: HexString,
  name?: UserNameDto,
  firstName?: string,
  lastName?: string,
  status: UserStatus,
  email: string,
  phone: string,
  pinfl?: string,
}

export type GetUserPreviewResponseDto = {
  success: boolean,
  data: UserPreviewDto,
} | ErrorDto;

export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  pinfl?: string;
  language?: Language;
  status?: UserStatus;
}

export type UpdateUserResponseDto = {
  success: boolean,
  user: UserResponseDto,
} | ErrorDto;

export type DeleteUserDto  = {
  id: HexString;
}

export type DeleteUserResponseDto = {
  success: boolean,
} | ErrorDto;


export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export type ChangePasswordQueryDto = {
  id: HexString;
}

export type ChangePasswordResponseDto = {
  success: boolean,
  user: UserResponseDto,
  tokens: {
    accessToken: string,
    refreshToken: string,
  }
} | ErrorDto;





