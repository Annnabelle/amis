import { Alert, Empty, Spin } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { resolveMultiLanguage } from "shared/lib";
import {
  getCompanyImportStageProgress,
  getCompanyImportStageVariant,
  getCompanyImportStatusVariant,
  isCompanyImportProgressSound,
  orderedCompanyImportStages,
  useCompanyImport,
} from "entities/companyImport/lib";
import {
  CompanyImportStageStatus,
  type CompanyImportTotals,
} from "entities/companyImport/types";
import CustomButton from "shared/ui/button";
import StatusBadge from "shared/ui/statusBadge";
import CompanyImportStartModal from "./startModal";
import "./styles.sass";

type CompanyImportPanelProps = {
  companyId?: string;
};

const formatDateTime = (value?: string) =>
  value ? dayjs(value).format("DD.MM.YYYY HH:mm") : "-";

/**
 * Ход импорта компании из ASL Belgisi: состояние прогона, этапы и их находки.
 * Пока прогон идёт, панель сама обновляется — опрос живёт в useCompanyImport.
 */
const CompanyImportPanel = ({ companyId }: CompanyImportPanelProps) => {
  const { t, i18n } = useTranslation();
  /** Находки и пометки приходят на всех языках: берём язык интерфейса. */
  const localized = (value: Parameters<typeof resolveMultiLanguage>[0]) =>
    resolveMultiLanguage(value, i18n.language);

  /** Пока знаменатель не сошёлся, показываем одно сделанное — без «из». */
  const progressLabel = (counters: CompanyImportTotals): string | null => {
    if (isCompanyImportProgressSound(counters)) {
      return t("companyImport.totals", {
        done: counters.done,
        queued: counters.queued,
      });
    }

    return counters.done > 0 ? t("companyImport.done", { done: counters.done }) : null;
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    canRead,
    canStart,
    companyImport,
    loaded,
    isLoading,
    isActive,
    error,
    startingStages,
    start,
  } = useCompanyImport(companyId);

  if (!canRead) {
    return <Empty description={t("common.missingPermissions")} />;
  }

  if (!loaded && isLoading) {
    return <Spin />;
  }

  const startButton = canStart ? (
    <CustomButton
      fullWidth={false}
      disabled={isActive}
      loading={!!startingStages}
      onClick={() => setIsModalOpen(true)}
      title={isActive ? t("companyImport.busyHint") : undefined}
    >
      {t("companyImport.start")}
    </CustomButton>
  ) : null;

  const modal = (
    <CompanyImportStartModal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      isStarting={!!startingStages}
      start={start}
    />
  );

  if (!companyImport) {
    return (
      <div className="company-import">
        {error && <Alert type="error" showIcon message={t(error)} />}
        <Empty description={t("companyImport.empty")}>{startButton}</Empty>
        {modal}
      </div>
    );
  }

  const stages = orderedCompanyImportStages(companyImport);

  return (
    <div className="company-import">
      {error && <Alert type="error" showIcon message={t(error)} />}

      <div className="company-import-header">
        <div className="company-import-header-main">
          <StatusBadge variant={getCompanyImportStatusVariant(companyImport.status)}>
            {t(`companyImport.statuses.${companyImport.status}`)}
          </StatusBadge>
          <span className="company-import-header-stage">
            {t("companyImport.currentStage", {
              stage: t(`companyImport.stages.${companyImport.stage}`),
            })}
          </span>
        </div>
        {startButton}
      </div>

      <div className="company-import-meta">
        <span>
          {t("companyImport.startedAt")}: {formatDateTime(companyImport.startedAt)}
        </span>
        {companyImport.finishedAt && (
          <span>
            {t("companyImport.finishedAt")}:{" "}
            {formatDateTime(companyImport.finishedAt)}
          </span>
        )}
        {progressLabel(companyImport.totals) && (
          <span>{progressLabel(companyImport.totals)}</span>
        )}
        {companyImport.totals.failed > 0 && (
          <span className="company-import-meta-failed">
            {t("companyImport.failed", { count: companyImport.totals.failed })}
          </span>
        )}
      </div>

      <ul className="company-import-stages">
        {stages.map((stage) => {
          const progress = getCompanyImportStageProgress(stage);
          const isSkipped = stage.status === CompanyImportStageStatus.Skipped;

          return (
            <li key={stage.stage} className="company-import-stage">
              <div className="company-import-stage-head">
                <span className="company-import-stage-title">
                  {t(`companyImport.stages.${stage.stage}`)}
                </span>
                <StatusBadge
                  mode="compact"
                  variant={getCompanyImportStageVariant(stage.status)}
                >
                  {t(`companyImport.stageStatuses.${stage.status}`)}
                </StatusBadge>
              </div>

              {!isSkipped && (
                <>
                  {/* Полоса считается от queued, а он растёт по ходу веера:
                      доля может и уменьшиться. */}
                  <div className="company-import-stage-bar">
                    <span
                      className="company-import-stage-bar-fill"
                      data-variant={getCompanyImportStageVariant(stage.status)}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="company-import-stage-counters">
                    {progressLabel(stage) && <span>{progressLabel(stage)}</span>}
                    {stage.failed > 0 && (
                      <span className="company-import-meta-failed">
                        {t("companyImport.failed", { count: stage.failed })}
                      </span>
                    )}
                    {stage.finishedAt && (
                      <span>{formatDateTime(stage.finishedAt)}</span>
                    )}
                  </div>
                </>
              )}

              {localized(stage.note) && (
                <p className="company-import-stage-note">{localized(stage.note)}</p>
              )}

              {stage.issues.length > 0 && (
                <ul className="company-import-stage-issues">
                  {stage.issues.map((issue, index) => (
                    <li key={`${stage.stage}-${index}`}>{localized(issue)}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {modal}
    </div>
  );
};

export default CompanyImportPanel;
