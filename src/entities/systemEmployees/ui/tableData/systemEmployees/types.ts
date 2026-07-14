import type {
  SystemRole,
  UserSystemAccessState,
} from "entities/systemEmployees/types";
import type { UserPreview } from "entities/users/types";

export type SystemEmployeeTableDataType = {
  key: string;
  user: UserPreview;
  roles: SystemRole[];
  state: UserSystemAccessState;
  createdAt: string;
};
