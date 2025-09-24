import type { ErrorDto, HexString, Language, PaginatedDto, PaginatedResponseDto, UserSortField, UserStatus } from "..";

export type LoginDto = {
  email: string;
  password: string;
}

export type UserResponseDto = {
  id: HexString,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  status: string,
  companyIds: HexString[],
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
  password: string;
  role: string; 
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

export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
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