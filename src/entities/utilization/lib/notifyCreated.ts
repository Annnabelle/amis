import type { TFunction } from "i18next";
import { notify } from 'shared/lib/notify';

/**
 * Итог создания отчётов о нанесении одним сообщением.
 *
 * Отчёты создаются и из таблицы заказов, и со страницы заказа — по одной партии
 * и по всем сразу. Текст живёт здесь, чтобы во всех этих местах он был один.
 */
export const notifyUtilizationReportsCreated = (
  t: TFunction,
  reportNumbers: readonly string[]
) => {
  if (!reportNumbers.length) {
    return;
  }

  if (reportNumbers.length === 1) {
    notify.success(
      t("markingCodes.utilization.createdOne", { number: reportNumbers[0] })
    );

    return;
  }

  notify.success(
    t("markingCodes.utilization.createdMany", { count: reportNumbers.length })
  );
};
