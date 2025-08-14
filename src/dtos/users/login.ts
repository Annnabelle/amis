import type { ErrorDto, HexString } from "..";

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