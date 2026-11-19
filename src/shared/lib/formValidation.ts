/**
 * Отказ antd Form.validateFields: форма не прошла проверку, и показывать
 * пользователю ещё и тост незачем — ошибки уже под полями.
 */
export const isFormValidationError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  Array.isArray((error as { errorFields?: unknown }).errorFields);
