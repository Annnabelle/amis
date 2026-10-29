import { Alert } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { resolveMultiLanguage } from "entities/lifecycle/lib";
import {
  LifecycleErrorClass,
  type LifecycleActiveError,
} from "entities/lifecycle/types";
import "../styles.sass";

type LifecycleActiveErrorAlertProps = {
  error: LifecycleActiveError;
  /** Ссылка «Открыть историю» — показываем, когда алерт висит вне вкладки. */
  action?: React.ReactNode;
};

const alertTypeByClass: Record<string, "error" | "warning"> = {
  [LifecycleErrorClass.Permanent]: "error",
  [LifecycleErrorClass.Conflict]: "warning",
  [LifecycleErrorClass.Transient]: "warning",
  [LifecycleErrorClass.Unknown]: "warning",
};

const LifecycleActiveErrorAlert = ({
  error,
  action,
}: LifecycleActiveErrorAlertProps) => {
  const { t, i18n } = useTranslation();
  const message = resolveMultiLanguage(error.message, i18n.language);

  return (
    <Alert
      className="lifecycle-active-error"
      type={alertTypeByClass[error.class] ?? "warning"}
      showIcon
      action={action}
      message={
        <>
          <span>{t(`lifecycle.errorClass.${error.class}`)}</span>
          <span className="lifecycle-code">
            {t("lifecycle.fields.code")} {error.code}
          </span>
        </>
      }
      description={
        <>
          {message}
          <div className="lifecycle-active-error-meta">
            {typeof error.occurrenceCount === "number" &&
              error.occurrenceCount > 1 && (
                <span>
                  {t("lifecycle.activeError.attempts", {
                    count: error.occurrenceCount,
                  })}
                </span>
              )}
            <span>
              {t("lifecycle.activeError.since", {
                date: dayjs(error.since).format("DD.MM.YYYY HH:mm"),
              })}
            </span>
          </div>
        </>
      }
    />
  );
};

export default LifecycleActiveErrorAlert;
