import type {
  SystemEmployeeAccessDto,
  SystemEmployeeResponseDto,
} from "entities/systemEmployees/dtos";
import type {
  SystemEmployee,
  SystemEmployeeAccess,
} from "entities/systemEmployees/types";

export const mapSystemEmployeeDtoToEntity = (
  dto: SystemEmployeeResponseDto
): SystemEmployee => ({
  id: dto.id,
  user: {
    id: dto.user.id,
    name: {
      first: dto.user.name.first,
      last: dto.user.name.last,
    },
    email: dto.user.email,
    phone: dto.user.phone,
    status: dto.user.status,
  },
  roles: dto.roles,
  state: dto.state,
  createdBy: dto.createdBy,
  updatedBy: dto.updatedBy,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

export const mapSystemEmployeeAccessDtoToEntity = (
  dto: SystemEmployeeAccessDto
): SystemEmployeeAccess => ({
  id: dto.id,
  userId: dto.userId,
  roles: dto.roles,
  state: dto.state,
  createdBy: dto.createdBy,
  updatedBy: dto.updatedBy,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
