import type { ErrorDto, UserStatus } from "shared/types/dtos";
import type {
  SystemRole,
  UserSystemAccessState,
} from "entities/systemEmployees/types";

export type CreateSystemEmployeeDto = {
  userId: string;
  roles: SystemRole[];
};

export type UpdateSystemEmployeeDto = {
  roles: SystemRole[];
};

export type GetSystemEmployeesQueryDto = {
  page: number;
  limit: number;
  sortBy?: "createdAt" | "updatedAt" | "firstName" | "lastName" | "email";
  sortOrder?: "asc" | "desc";
  state?: UserSystemAccessState;
  role?: SystemRole;
  query?: string;
};

export type SystemEmployeeDto = {
  id: string;
  user: {
    id: string;
    name: {
      first: string;
      last: string;
    };
    email: string;
    phone: string;
    status: UserStatus | string;
  };
  roles: SystemRole[];
  state: UserSystemAccessState;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type SystemEmployeeAccessDto = {
  id: string;
  userId: string;
  roles: SystemRole[];
  state: UserSystemAccessState;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SystemEmployeeResponseDto = SystemEmployeeDto;

export type SystemEmployeesResponseDto =
  | {
      success: true;
      data: SystemEmployeeDto[];
      page: number;
      limit: number;
      total: number;
    }
  | ErrorDto;

export type SystemEmployeeSingleResponseDto =
  | {
      success: true;
      data: SystemEmployeeResponseDto;
    }
  | ErrorDto;

export type SystemEmployeeAccessResponseDto =
  | {
      success: true;
      data: SystemEmployeeAccessDto;
    }
  | ErrorDto;

export type DeleteSystemEmployeeResponseDto =
  | {
      success: true;
    }
  | ErrorDto;

export const isSystemEmployeesResponseSuccess = (
  dto: SystemEmployeesResponseDto
): dto is Extract<SystemEmployeesResponseDto, { success: true; data: SystemEmployeeDto[] }> =>
  dto.success === true && "data" in dto;

export const isSystemEmployeeSingleResponseSuccess = (
  dto: SystemEmployeeSingleResponseDto
): dto is Extract<SystemEmployeeSingleResponseDto, { success: true; data: SystemEmployeeResponseDto }> =>
  dto.success === true && "data" in dto;

export const isSystemEmployeeAccessResponseSuccess = (
  dto: SystemEmployeeAccessResponseDto
): dto is Extract<SystemEmployeeAccessResponseDto, { success: true; data: SystemEmployeeAccessDto }> =>
  dto.success === true && "data" in dto;
