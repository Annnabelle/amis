let currentCompanyId: string | null = null;

export const setRuntimeCompanyId = (companyId: string | null) => {
  currentCompanyId = companyId;
};

export const getRuntimeCompanyId = () => currentCompanyId;
