import { Component, type ErrorInfo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Result } from "antd";

import CustomButton from "shared/ui/button";

type ErrorBoundaryFallbackProps = {
  onRetry: () => void;
};

/** Фолбэк — функция: граница обязана быть классом, а переводы берёт хук. */
const ErrorBoundaryFallback = ({ onRetry }: ErrorBoundaryFallbackProps) => {
  const { t } = useTranslation();

  return (
    <Result
      status="error"
      title={t("errorBoundary.title")}
      subTitle={t("errorBoundary.description")}
      extra={[
        <CustomButton
          key="retry"
          variant="primary"
          fullWidth={false}
          onClick={onRetry}
        >
          {t("errorBoundary.retry")}
        </CustomButton>,
        <CustomButton
          key="reload"
          variant="outline"
          fullWidth={false}
          onClick={() => window.location.reload()}
        >
          {t("errorBoundary.reload")}
        </CustomButton>,
      ]}
    />
  );
};

type ErrorBoundaryProps = {
  children: ReactNode;
  /**
   * Смена значения поднимает упавшее поддерево заново. Страницы передают сюда
   * путь: уход на другой экран не должен оставлять границу сломанной.
   */
  resetKey?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Граница ошибок рендера: ошибка в поддереве заменяется фолбэком, остальное
 * приложение продолжает работать.
 *
 * Отправки в мониторинг нет: сервиса нет. Когда появится — одно место,
 * componentDidCatch.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("[render error]", error, info.componentStack);
    }
  }

  componentDidUpdate(previous: ErrorBoundaryProps) {
    if (this.state.hasError && previous.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  private handleRetry = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
