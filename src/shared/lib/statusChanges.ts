import { useEffect, useRef, useState } from "react";

import type { MultiLanguage } from "shared/types/dtos";

/**
 * Уведомление о переходе статуса — то, что приходит в сокет.
 * Форма повторяет StatusChangeResponseDto бэкенда.
 */
export type StatusChangeNotification = {
  target: {
    id: string;
    /** Номер записи: «ORDER-5». Пусто, если сервис его не проставляет. */
    title: string | null;
    type: {
      /** Машинное имя сущности бэкенда: по нему ищется страница. */
      name: string;
      label: MultiLanguage | null;
    };
  };
  status: {
    from: string | null;
    fromLabel: MultiLanguage | null;
    to: string;
    toLabel: MultiLanguage | null;
  };
  at: string;
  /** Кто перевёл запись. Пусто у переходов системы и вендора. */
  actorUserId: string | null;
};

export const STATUS_CHANGE_EVENT = "status-change";

/**
 * Межслойный сигнал через событие окна — та же идиома, что у
 * AUTH_SESSION_EXPIRED_EVENT: слушателю не нужен ни стор, ни провайдер.
 */
export const emitStatusChange = (notification: StatusChangeNotification) => {
  window.dispatchEvent(
    new CustomEvent<StatusChangeNotification>(STATUS_CHANGE_EVENT, {
      detail: notification,
    }),
  );
};

export const subscribeToStatusChanges = (
  handler: (notification: StatusChangeNotification) => void,
) => {
  const listener = (event: Event) => {
    handler((event as CustomEvent<StatusChangeNotification>).detail);
  };

  window.addEventListener(STATUS_CHANGE_EVENT, listener);

  return () => window.removeEventListener(STATUS_CHANGE_EVENT, listener);
};

/**
 * Перечитать открытую карточку, когда её статус сменился на сервере.
 *
 * Одна строка на страницу: useStatusChangeRefresh(target, id, refresh).
 *
 * Id можно передать набором: на карточке заказа лежат его партии, и переходы
 * по ним приходят отдельными событиями со своими id — заказ о них узнаёт
 * только так.
 */
export const useStatusChangeRefresh = (
  targetType: string | null | undefined,
  targetIds: string | readonly string[] | null | undefined,
  refresh: () => void,
) => {
  const watched: string = Array.isArray(targetIds)
    ? targetIds.join(",")
    : ((targetIds as string | null | undefined) ?? "");

  useEffect(() => {
    if (!targetType || !watched) {
      return;
    }

    const ids = new Set(watched.split(","));

    return subscribeToStatusChanges((notification) => {
      if (
        notification.target.type.name === targetType &&
        ids.has(notification.target.id)
      ) {
        refresh();
      }
    });
  }, [refresh, targetType, watched]);
};

const listRefreshers = new Map<string, Set<() => void>>();

/**
 * Открытый список перечитывает себя по кнопке в тосте.
 *
 * Страница сама знает, чем перечитаться, поэтому отдаёт сюда свою функцию;
 * пока она смонтирована, список считается видимым, и кнопка в тосте есть.
 */
export const useStatusChangeListRefresh = (
  targetTypes: string | readonly string[],
  refresh: () => void,
) => {
  const watched: string = Array.isArray(targetTypes)
    ? targetTypes.join(",")
    : (targetTypes as string);

  // Функция страницы замкнута на её фильтры и меняется каждый рендер.
  const latest = useRef(refresh);
  latest.current = refresh;

  useEffect(() => {
    const types = watched.split(",").filter(Boolean);
    const run = () => latest.current();

    types.forEach((type) => {
      const refreshers = listRefreshers.get(type) ?? new Set<() => void>();

      refreshers.add(run);
      listRefreshers.set(type, refreshers);
    });

    return () => {
      types.forEach((type) => {
        const refreshers = listRefreshers.get(type);

        refreshers?.delete(run);

        if (refreshers?.size === 0) {
          listRefreshers.delete(type);
        }
      });
    };
  }, [watched]);
};

export const hasStatusChangeListRefresh = (targetType: string): boolean =>
  Boolean(listRefreshers.get(targetType)?.size);

export const refreshStatusChangeList = (targetType: string) => {
  listRefreshers.get(targetType)?.forEach((refresh) => refresh());
};

/**
 * Сколько строка числится «только что изменившейся». Запас над анимацией в
 * стилях таблицы нужен для строки, которая отрисуется позже уведомления:
 * список успеет перечитаться, а подсветка ещё не истечёт.
 */
const HIGHLIGHT_MS = 4000;

/**
 * Id записей, статус которых только что сменился: таблица подсвечивает их
 * строки через rowClassName.
 *
 * Правка статуса на месте меняет один тег в строке — в списке из двадцати строк
 * этого не видно, пока строку не подсветишь.
 */
export const useRecentStatusChanges = (
  targetTypes: string | readonly string[],
): ReadonlySet<string> => {
  const watched: string = Array.isArray(targetTypes)
    ? targetTypes.join(",")
    : (targetTypes as string);

  const [changed, setChanged] = useState<ReadonlySet<string>>(new Set());
  const timers = useRef(new Map<string, number>());

  useEffect(() => {
    const types = new Set(watched.split(",").filter(Boolean));
    const running = timers.current;

    const unsubscribe = subscribeToStatusChanges((notification) => {
      if (!types.has(notification.target.type.name)) {
        return;
      }

      const id = notification.target.id;
      const previous = running.get(id);

      if (previous) {
        window.clearTimeout(previous);
      }

      setChanged((prev) => new Set(prev).add(id));

      running.set(
        id,
        window.setTimeout(() => {
          running.delete(id);
          setChanged((prev) => {
            const next = new Set(prev);

            next.delete(id);

            return next;
          });
        }, HIGHLIGHT_MS),
      );
    });

    return () => {
      unsubscribe();
      running.forEach((timer) => window.clearTimeout(timer));
      running.clear();
    };
  }, [watched]);

  return changed;
};
