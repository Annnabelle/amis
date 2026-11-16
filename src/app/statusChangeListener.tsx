import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import type { Socket } from "socket.io-client";

import { store, useAppDispatch, useAppSelector } from "app/store";
import { statusChangePatchOf } from "app/statusChangePatches";
import { resolveStatusChangeCard } from "entities/lifecycle/lib/statusChangeEntities";
import StatusChangeToast from "entities/lifecycle/ui/statusChangeToast";
import { connectStatusChanges } from "shared/lib/statusChangeSocket";
import {
  hasStatusChangeListRefresh,
  refreshStatusChangeList,
  subscribeToStatusChanges,
  type StatusChangeNotification,
} from "shared/lib/statusChanges";

/**
 * Джоба прогоняет запись через несколько статусов за секунды. События по одной
 * записи склеиваются в одно, от первого известного статуса к последнему.
 */
const COALESCE_DELAY_MS = 400;

/**
 * Уведомления о переходах статуса: соединение и выбор поверхности.
 *
 * Поверхность выбирается здесь, потому что только здесь известен адрес
 * страницы:
 *
 * - открыта карточка этой записи → ничего не показываем, страница сама
 *   перечитает себя через useStatusChangeRefresh;
 * - запись есть в загруженном списке → правим статус в строке и показываем тост
 *   без кнопки: перечитывать уже нечего;
 * - списка с этой записью нет → тост с кнопкой, которая его перечитает.
 */
const StatusChangeListener = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state.users.isAuthenticated,
  );
  const accessToken = useAppSelector((state) => state.users.accessToken);
  const companyId = useAppSelector((state) => state.access.currentCompanyId);
  const currentUserId = useAppSelector(
    (state) => state.users.currentUser?.id ?? null,
  );

  /**
   * Адрес, компания и пользователь меняются чаще, чем соединение, и
   * переподключать сокет из-за перехода по страницам незачем — обработчик
   * читает их отсюда.
   */
  const current = useRef({
    pathname: location.pathname,
    companyId,
    currentUserId,
  });
  current.current = {
    pathname: location.pathname,
    companyId,
    currentUserId,
  };

  const pending = useRef(
    new Map<string, { notification: StatusChangeNotification; timer: number }>(),
  );

  const show = useCallback(
    (notification: StatusChangeNotification) => {
      const {
        pathname,
        companyId: company,
        currentUserId: viewer,
      } = current.current;
      const entity = notification.target.type.name;

      const patch = statusChangePatchOf(store.getState(), notification);

      if (patch) {
        dispatch(patch);
      }

      // Своё действие пользователь уже увидел ответом на свой запрос.
      if (notification.actorUserId && notification.actorUserId === viewer) {
        return;
      }

      const card = resolveStatusChangeCard(entity, {
        id: notification.target.id,
        companyId: company,
      });

      // Карточка открыта: перечитает себя сама, тост был бы шумом.
      if (card && pathname === card) {
        return;
      }

      // Список сам сообщает о себе, пока он на экране.
      const onList = !patch && hasStatusChangeListRefresh(entity);

      const content = (
        <StatusChangeToast
          notification={notification}
          open={
            card
              ? { label: t("statusChange.open"), run: () => navigate(card) }
              : undefined
          }
          refresh={
            onList
              ? {
                  label: t("statusChange.refresh"),
                  run: () => refreshStatusChangeList(entity),
                }
              : undefined
          }
        />
      );
      const toastId = `status-change-${notification.target.id}`;

      // Открытый тост по этой же записи переписывается: иначе следующий переход
      // отбросится как повтор.
      if (toast.isActive(toastId)) {
        toast.update(toastId, { render: content });

        return;
      }

      toast.info(content, { toastId, className: "lifecycle-toast-card" });
    },
    [dispatch, navigate, t],
  );

  const handle = useCallback(
    (notification: StatusChangeNotification) => {
      const key = `${notification.target.type.name}:${notification.target.id}`;
      const queued = pending.current.get(key);

      if (queued) {
        window.clearTimeout(queued.timer);
      }

      const coalesced = queued
        ? {
            ...notification,
            status: {
              ...notification.status,
              from: queued.notification.status.from,
              fromLabel: queued.notification.status.fromLabel,
            },
          }
        : notification;

      pending.current.set(key, {
        notification: coalesced,
        timer: window.setTimeout(() => {
          pending.current.delete(key);
          show(coalesced);
        }, COALESCE_DELAY_MS),
      });
    },
    [show],
  );

  useEffect(() => subscribeToStatusChanges(handle), [handle]);

  useEffect(() => {
    const queue = pending.current;

    return () => {
      queue.forEach(({ timer }) => window.clearTimeout(timer));
      queue.clear();
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return;
    }

    let socket: Socket | null = connectStatusChanges(accessToken);

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [accessToken, isAuthenticated]);

  return null;
};

export default StatusChangeListener;
