import type { ErrorDto, HexString, Language, PaginatedDto, PaginatedResponseDto, UserSortField, UserStatus } from "shared/types/dtos";

import type { AppTheme, UserPreferences } from "shared/types/dtos";

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
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  pinfl?: string,
  status: UserStatus,
  preferences: UserPreferences,
  emailVerifiedAt: string | null,
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
  pinfl?: string;
  password: string;
}

// admin-created user: no password, activation email is sent by the backend
export type CreateUserDto = Omit<RegisterUserDto, "password">;

export type VerifyEmailDto = {
  token: string;
}

export type SetPasswordDto = {
  token: string;
  password: string;
}

// register / verify-email / set-password / admin create
export type AccountActionResponseDto = {
  success: boolean,
  user: UserResponseDto,
} | ErrorDto;

export type ForgotPasswordDto = {
  email: string;
}

export type ForgotPasswordResponseDto = {
  success: boolean;
}

export type ResetPasswordDto = {
  token: string;
  password: string;
}

export type ResetPasswordResponseDto = AccountActionResponseDto;

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
  status?: UserStatus;
}

export type UpdateUserResponseDto = {
  success: boolean,
  user: UserResponseDto,
} | ErrorDto;

export type UpdateUserPreferencesDto = {
  language?: Language;
  theme?: AppTheme;
};

export type UpdateUserPreferencesResponseDto = {
  success: true;
  user: UserResponseDto;
};

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





