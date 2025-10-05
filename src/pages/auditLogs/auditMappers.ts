export const CategoryMap: Record<string, string> = {
    user: "categories.user",
    report: "categories.report",
    product: "categories.product",
    auth: "categories.auth",
    company: 'categories.organization',
  };

export const ActionsMap: Record<string, Record<string, string>> = {
    user: {
      login: "logsActions.user.login",
      logout: "logsActions.user.logout",
      userRegistration: "logsActions.user.userRegistration",
      passwordChange: "logsActions.user.passwordChange",
      unassignCompanyFromUser: "logsActions.user.unassignCompanyFromUser",
      assignCompanyToUser: "logsActions.user.assignCompanyToUser",
      userUpdate: "logsActions.user.userUpdate",
      userDelete: "logsActions.user.userDelete",
    },
    object: {
      productCreate: "logsActions.object.productCreate",
      productUpdate: "logsActions.object.productUpdate",
      productDelete: "logsActions.object.productDelete",
    },
    company: {
      companyCreate: "logsActions.organization.organizationCreate",
      companyUpdate: "logsActions.organization.organizationUpdate",
      companyDelete: "logsActions.organization.organizationDelete",
    },
    auth: {
      userRegistration: "logsActions.user.userRegistration",
    }
  };

export const TypeMap: Record<string, string> = {
    login: "logsActions.types.login",
    logout: "logsActions.types.logout",
    userRegistration: "logsActions.types.userRegistration",
    passwordChange: "logsActions.types.passwordChange",
    productCreate: "logsActions.types.productCreate",
    productUpdate: "logsActions.types.productUpdate",
    productDelete: "logsActions.types.productDelete",
    organizationCreate: "logsActions.organization.organizationCreate",
    organizationUpdate: "logsActions.organization.organizationUpdate",
    organizationDelete: "logsActions.organization.organizationDelete",
    unassignCompanyFromUser: "logsActions.user.unassignCompanyFromUser",
    assignCompanyToUser: "logsActions.user.assignCompanyToUser",
    userUpdate: "logsActions.user.userUpdate",
    userDelete: "logsActions.user.userDelete",
  };

