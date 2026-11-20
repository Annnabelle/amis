import type { LoginResponseDto } from "@edem2000/amis.contracts/api/users/responses";
import type { SuccessOf } from "shared/api";

/**
 * Расхождение с пакетом 0.1.5: он ещё отдаёт в теле ответа refreshToken и не
 * знает про refreshExpiresAt. refresh переехал в httpOnly-cookie (AUTH-4), в
 * теле остался access и срок окончания сессии.
 *
 * Блокирует мерж ветки: пока 0.1.6 не опубликован и этот файл не удалён,
 * фронт описывает контракт сам, а так быть не должно.
 */
export type LoginResponseBodyDto = Omit<SuccessOf<LoginResponseDto>, "tokens"> & {
  tokens: {
    accessToken: string;
    refreshExpiresAt: string;
  };
};

/** Смена своего пароля отдаёт то же тело, что и вход. */
export type ChangePasswordResponseBodyDto = LoginResponseBodyDto;
