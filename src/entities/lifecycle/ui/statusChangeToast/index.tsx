import { useTranslation } from "react-i18next";

import { resolveStatusChangeStatusEntity } from "entities/lifecycle/lib/statusChangeEntities";
import { resolveMultiLanguage } from "shared/lib/multiLanguage";
import CustomButton from "shared/ui/button";
import type { StatusChangeNotification } from "shared/lib/statusChanges";
import EntityStatusBadge from "shared/ui/statusBadge/entityStatus";

import "../styles.sass";

type StatusChangeAction = {
  label: string;
  run: () => void;
};

type StatusChangeToastProps = {
  notification: StatusChangeNotification;
  /** Есть страница записи — имя ведёт на неё. */
  open?: StatusChangeAction;
  /** Открыт список этого типа — предлагаем обновить его. */
  refresh?: StatusChangeAction;
};

const ActionLink = ({
  label,
  run,
  children,
}: StatusChangeAction & { children?: string }) => (
  <a
    role="button"
    tabIndex={0}
    title={label}
    onClick={run}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        run();
      }
    }}
  >
    {children ?? label}
  </a>
);

/**
 * Тело тоста: имя записи и переход статуса тегами.
 *
 * Теги те же, что на карточках и в ленте журнала: цвет и подпись берутся из
 * каталога статусов по ключу сущности, подпись из уведомления идёт запасным
 * вариантом — для кодов, которых в каталоге ещё нет.
 */
const StatusChangeToast = ({
  notification,
  open,
  refresh,
}: StatusChangeToastProps) => {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const statusEntity = resolveStatusChangeStatusEntity(
    notification.target.type.name,
  );
  const typeLabel = resolveMultiLanguage(
    notification.target.type.label,
    language,
  );
  const name = [typeLabel, notification.target.title].filter(Boolean).join(" ");

  return (
    <div className="lifecycle-toast">
      <div>{open ? <ActionLink {...open}>{name}</ActionLink> : name}</div>

      <div className="lifecycle-toast-transition">
        {notification.status.from ? (
          <>
            <EntityStatusBadge
              entity={statusEntity}
              status={notification.status.from}
              fallbackLabel={resolveMultiLanguage(
                notification.status.fromLabel,
                language,
              )}
              mode="compact"
            />
            <span aria-hidden="true">→</span>
          </>
        ) : null}
        <EntityStatusBadge
          entity={statusEntity}
          status={notification.status.to}
          fallbackLabel={resolveMultiLanguage(
            notification.status.toLabel,
            language,
          )}
          mode="compact"
        />
      </div>

      {refresh ? (
        <div className="lifecycle-toast-action">
          <CustomButton
            variant="outline"
            size="sm"
            fullWidth={false}
            onClick={refresh.run}
          >
            {refresh.label}
          </CustomButton>
        </div>
      ) : null}
    </div>
  );
};

export default StatusChangeToast;
