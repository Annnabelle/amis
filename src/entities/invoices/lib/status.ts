export const getInvoiceStatusKey = (status?: string): string => {
  if (!status) return "";

  return status
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
};
