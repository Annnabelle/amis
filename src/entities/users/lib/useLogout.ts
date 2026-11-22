import { useCallback } from "react";
import { useAppDispatch } from "app/store";
import { useLogoutMutation } from "entities/users/api";
import { logout } from "entities/users/model";

/**
 * Единственный способ выйти: сначала сервер снимает httpOnly-cookie, потом
 * чистится состояние на экране. Отказ запроса выход не отменяет — локальная
 * сессия всё равно закончена.
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const [requestLogout] = useLogoutMutation();

  return useCallback(async () => {
    try {
      await requestLogout().unwrap();
    } catch {
      // Сервер недоступен или cookie уже нет — выходим локально.
    }

    dispatch(logout());
  }, [dispatch, requestLogout]);
};
