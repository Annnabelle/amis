import type { ExportAggregationReportParams } from "entities/export/types";
import { getFileNameFromDisposition } from "shared/lib";
import axiosInstance from "shared/lib/axiosInstance";
import { BASE_URL } from "shared/lib/consts";

/**
 * Выгрузка отчёта агрегации файлом. Это не серверное состояние и не кешируется,
 * поэтому запрос идёт напрямую, а не через RTK Query: ответ — blob, имя файла
 * приходит в content-disposition.
 */
export const downloadAggregationReport = async (
  aggregationId: string,
  params: ExportAggregationReportParams
): Promise<void> => {
  const response = await axiosInstance.get(
    `${BASE_URL}/reports/aggregation/${aggregationId}/export`,
    { params, responseType: "blob" }
  );

  const filename =
    getFileNameFromDisposition(response.headers["content-disposition"]) ??
    "report.csv";
  const blob = new Blob([response.data], {
    type: response.data.type || "text/csv",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
