export const getWaybillStatusKey = (status?: string): string => {
  if (!status) return "unknown";

  return status
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
};
