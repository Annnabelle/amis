import type { SystemEmployeeResponseDto } from "entities/systemEmployees/dtos";
import type { SystemEmployee } from "entities/systemEmployees/types";

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
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
