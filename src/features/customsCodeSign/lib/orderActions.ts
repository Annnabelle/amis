import {
  AggregatedCustomsCodeOrderStatus,
  type CustomsCodeOrder,
} from "entities/customsCodes/types";

/**
 * Что можно сделать с заказом ТН ВЭД — по его статусу.
 *
 * Документ со всеми кодами партии в строку списка не приезжает, его подтягивает
 * модалка подписи, поэтому решение принимается по статусу.
 */
export const canSignRegistration = (order: CustomsCodeOrder) =>
  order.status === AggregatedCustomsCodeOrderStatus.ReadyForSign ||
  order.status === AggregatedCustomsCodeOrderStatus.SignedForRegistration;

/** Отказ вендора оставляет код зарегистрированным, поэтому снять его можно и из него. */
export const canInitiateDissolution = (order: CustomsCodeOrder) =>
  order.status === AggregatedCustomsCodeOrderStatus.Registered ||
  order.status === AggregatedCustomsCodeOrderStatus.DissolutionFailed;

/** Отказ регистрации: второй заказ на партию не заводится, повтор идёт по этому же. */
export const canResume = (order: CustomsCodeOrder) =>
  order.status === AggregatedCustomsCodeOrderStatus.RegistrationFailed;

export const canSignDissolution = (order: CustomsCodeOrder) =>
  order.status === AggregatedCustomsCodeOrderStatus.DissolutionInitialized ||
  order.status === AggregatedCustomsCodeOrderStatus.SignedForDissolution;

export type CustomsCodeSignMode = "registration" | "dissolution";

/** Документ под подпись лежит в своей ветке заказа. */
export const getDocumentForSigning = (
  order: CustomsCodeOrder,
  mode: CustomsCodeSignMode,
) =>
  mode === "registration"
    ? order.external.registration.documentBase64
    : order.external.dissolution.documentBase64;

export const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));
