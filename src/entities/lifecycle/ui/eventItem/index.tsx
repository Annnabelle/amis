import { ApiOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  getLifecycleErrorVariant,
  resolveMultiLanguage,
  type LifecycleTargetType,
} from "entities/lifecycle/lib";
import {
  LifecycleActorType,
  LifecycleEventKind,
  LifecycleScope,
  type LifecycleEvent,
} from "entities/lifecycle/types";
import { UserPreviewCardById } from "entities/users/ui/userPreviewCard";
import { isStatusEntity, type StatusScope } from "shared/config/statusCatalog";
import StatusBadge from "shared/ui/statusBadge";
import EntityStatusBadge from "shared/ui/statusBadge/entityStatus";
import "../styles.sass";

type LifecycleEventItemProps = {
  event: LifecycleEvent;
  /** Нужен, чтобы взять подпись и цвет статуса из каталога сущности. */
  target: LifecycleTargetType;
  isLast?: boolean;
};

const LifecycleEventItem = ({
  event,
  target,
  isLast = false,
}: LifecycleEventItemProps) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const isError = event.kind === LifecycleEventKind.Error;
  const isExternal = event.scope === LifecycleScope.External;

  /**
   * Подпись берём из каталога: он общий с карточками сущностей, значит одна
   * и та же формулировка в ленте и в поле «Статус». toLabel с бэкенда идёт
   * запасным вариантом — для кодов, которых в каталоге ещё нет.
   */
  const statusEntity = isStatusEntity(target) ? target : undefined;
  const eventScope = event.scope as StatusScope;
  const fromFallback = resolveMultiLanguage(event.status?.fromLabel, language);
  const toFallback = resolveMultiLanguage(event.status?.toLabel, language);
  const errorMessage = resolveMultiLanguage(event.error?.message, language);
  /**
   * Вендор приходит в scope = external, но у внутреннего события его может
   * принести актор (webhook от вендора сменил наш статус) — тег показываем
   * в обоих случаях, он же несёт конкретное имя системы.
   */
  const vendorCode =
    event.vendor ??
    (event.actor?.type === LifecycleActorType.Vendor
      ? event.actor.vendor
      : undefined);
  const vendorLabel = vendorCode
    ? t(`lifecycle.vendors.${vendorCode}`, { defaultValue: vendorCode })
    : null;

  const technicalItems = [
    event.requestId
      ? { label: t("lifecycle.fields.requestId"), value: event.requestId }
      : null,
    event.correlationId
      ? { label: t("lifecycle.fields.correlationId"), value: event.correlationId }
      : null,
    event.causedByEventId
      ? { label: t("lifecycle.fields.causedBy"), value: event.causedByEventId }
      : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  const hasTechnicalBlock = technicalItems.length > 0 || Boolean(event.error?.details);

  return (
    <li className="lifecycle-event">
      <span className="lifecycle-event-rail">
        <span
          className="lifecycle-event-dot"
          data-scope={event.scope}
          data-kind={isError ? LifecycleEventKind.Error : LifecycleEventKind.Status}
        />
        {!isLast && <span className="lifecycle-event-line" />}
      </span>

      <div className="lifecycle-event-body" data-scope={event.scope}>
        <div className="lifecycle-event-head">
          {event.status ? (
            <div className="lifecycle-event-status">
              {event.status.from ? (
                <>
                  <EntityStatusBadge
                    entity={statusEntity}
                    scope={eventScope}
                    status={event.status.from}
                    fallbackLabel={fromFallback}
                  />
                  <span className="lifecycle-event-arrow">→</span>
                </>
              ) : (
                <span className="lifecycle-event-chip">
                  {t("lifecycle.firstStatus")}
                </span>
              )}
              <EntityStatusBadge
                entity={statusEntity}
                scope={eventScope}
                status={event.status.to}
                fallbackLabel={toFallback}
              />
            </div>
          ) : (
            <div className="lifecycle-event-status">
              <StatusBadge variant={getLifecycleErrorVariant(event.error?.class)}>
                {t(`lifecycle.errorClass.${event.error?.class ?? "unknown"}`)}
              </StatusBadge>
            </div>
          )}

          <div className="lifecycle-event-tags">
            {vendorLabel && (
              <span
                className="lifecycle-event-vendor"
                title={t("lifecycle.externalHint", { vendor: vendorLabel })}
              >
                <ApiOutlined />
                {vendorLabel}
              </span>
            )}

            {event.origin && (
              <span className="lifecycle-event-chip">
                {t(`lifecycle.origin.${event.origin}`, { defaultValue: event.origin })}
              </span>
            )}

            <span
              className="lifecycle-event-time"
              title={dayjs(event.occurredAt).format("DD.MM.YYYY HH:mm:ss")}
            >
              {dayjs(event.occurredAt).format("HH:mm")}
            </span>
          </div>
        </div>

        <div className="lifecycle-event-meta">
          {event.actor?.type === LifecycleActorType.User && event.actor.userId ? (
            <UserPreviewCardById userId={event.actor.userId} />
          ) : (
            <span className="lifecycle-event-chip">
              {event.actor?.type === LifecycleActorType.Vendor
                ? t("lifecycle.actor.vendor")
                : t("lifecycle.actor.system")}
            </span>
          )}

          {isExternal && (
            <span className="lifecycle-event-scope">
              {t("lifecycle.scopes.external")}
            </span>
          )}

          {event.status?.reasonCode && (
            <span className="lifecycle-event-chip">
              {t("lifecycle.fields.reason")}: {event.status.reasonCode}
            </span>
          )}
        </div>

        {event.status?.comment && (
          <p className="lifecycle-event-note">{event.status.comment}</p>
        )}

        {event.error && (
          <div className="lifecycle-event-error">
            <div className="lifecycle-event-error-head">
              <span className="lifecycle-code">
                {t("lifecycle.fields.code")} {event.error.code}
              </span>
              {typeof event.error.occurrenceCount === "number" &&
                event.error.occurrenceCount > 1 && (
                  <span
                    className="lifecycle-event-chip"
                    title={
                      event.error.lastOccurredAt
                        ? `${t("lifecycle.fields.lastOccurredAt")}: ${dayjs(
                            event.error.lastOccurredAt
                          ).format("DD.MM.YYYY HH:mm")}`
                        : undefined
                    }
                  >
                    ×{event.error.occurrenceCount}
                  </span>
                )}
            </div>

            {errorMessage && (
              <p className="lifecycle-event-error-message">{errorMessage}</p>
            )}

            <span className="lifecycle-event-error-hint">
              {t(`lifecycle.errorHint.${event.error.class}`, { defaultValue: "" })}
            </span>
          </div>
        )}

        {hasTechnicalBlock && (
          <Collapse
            className="lifecycle-technical"
            ghost
            size="small"
            items={[
              {
                key: "technical",
                label: t("lifecycle.fields.technical"),
                children: (
                  <div className="lifecycle-technical-items">
                    {technicalItems.map((item) => (
                      <div className="lifecycle-technical-item" key={item.label}>
                        <span className="label">{item.label}:</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                    {event.error?.details && (
                      <pre className="lifecycle-technical-json">
                        {JSON.stringify(event.error.details, null, 2)}
                      </pre>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>
    </li>
  );
};

export default LifecycleEventItem;
