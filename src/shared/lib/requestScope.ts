import 'axios';

/**
 * Управление заголовком x-company-id на уровне отдельного запроса.
 *
 * Auto — заголовок подставляется автоматически, если компания есть в контексте
 *        (поведение по умолчанию, как было до появления OptionalCompany).
 * None — заголовок намеренно не отправляется. Нужен для эндпоинтов со scope
 *        OptionalCompany, где системный сотрудник читает данные сущности,
 *        у которой компании нет вовсе (например заявка с сайта).
 */
export const CompanyScopeOptions = {
  Auto: 'auto',
  None: 'none',
} as const;

export type CompanyScopeOption =
  (typeof CompanyScopeOptions)[keyof typeof CompanyScopeOptions];

declare module 'axios' {
  export interface AxiosRequestConfig {
    companyScope?: CompanyScopeOption;
  }
}
