import type {
  CompanyMembershipState,
  CompanyRole,
} from "entities/companyMemberships/types";
import type { UserPreview } from "entities/users/types";

export type CompanyMembershipTableDataType = {
  key: string;
  userId: string;
  user: UserPreview;
  roles: CompanyRole[];
  state: CompanyMembershipState;
  createdAt: string;
};
