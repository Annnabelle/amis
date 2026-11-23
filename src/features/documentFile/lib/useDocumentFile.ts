import { useState } from "react";

import type { AxiosResponse } from "axios";

import { getFileNameFromDisposition } from "shared/lib/utils";
import { notify } from "shared/lib/notify";

/** Отозвать ссылку сразу нельзя: открытая вкладка ещё читает документ. */
const BLOB_LIFETIME = 60_000;

/**
 * Печатная форма документа: открыть в соседней вкладке или скачать.
 *
 * Документ собирает бэкенд и отдаёт потоком, поэтому запрос идёт мимо кеша
 * RTK Query, а имя файла берётся из заголовка ответа. Сам запрос приходит
 * снаружи: адрес должен оставаться литералом, иначе его не сверить с картой
 * доступа.
 */
export const useDocumentFile = ({
  request: loadFile,
  fallbackName,
  openErrorMessage,
  loadErrorMessage,
}: {
  /** Запрос файла: отдаёт ответ потоком. Пусто — записи ещё нет. */
  request?: (download: boolean) => Promise<AxiosResponse<Blob>>;
  fallbackName: string;
  openErrorMessage: string;
  loadErrorMessage: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const request = async (download: boolean) => {
    if (!loadFile || isLoading) return;

    setIsLoading(true);

    try {
      const response = await loadFile(download);
      const blob = new Blob([response.data], {
        type: response.data.type || "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);

      if (download) {
        const filename =
          getFileNameFromDisposition(response.headers["content-disposition"]) ?? fallbackName;
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return;
      }

      /**
       * Изоляция открытой вкладки — через opener = null: window.open с
       * noopener возвращает null, и блокировку вкладки не отличить от
       * успеха, а blob-ссылку надо отозвать.
       */
      const openedWindow = window.open(url, "_blank");

      if (openedWindow) {
        openedWindow.opener = null;
        window.setTimeout(() => window.URL.revokeObjectURL(url), BLOB_LIFETIME);
      } else {
        window.URL.revokeObjectURL(url);
        notify.error(openErrorMessage);
      }
    } catch {
      notify.error(loadErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    open: () => request(false),
    download: () => request(true),
  };
};
