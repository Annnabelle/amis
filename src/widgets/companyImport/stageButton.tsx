import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useCompanyImportStage } from "entities/companyImport/lib";
import {
  CompanyImportStageStatus,
  type CompanyImportStage,
} from "entities/companyImport/types";
import CustomButton from "shared/ui/button";
import type { ButtonVariant } from "shared/ui/button";

type CompanyImportStageButtonProps = {
  companyId?: string;
  stage: CompanyImportStage;
  variant?: ButtonVariant;
};

const unfinishedStageStatuses: readonly string[] = [
  CompanyImportStageStatus.Pending,
  CompanyImportStageStatus.Running,
];

/**
 * Запуск импорта одного раздела. Прогон на компанию ровно один, поэтому пока
 * он идёт, кнопка показывает его ход, а не предлагает запустить второй.
 */
const CompanyImportStageButton = ({
  companyId,
  stage,
  variant = "outline",
}: CompanyImportStageButtonProps) => {
  const { t } = useTranslation();
  const { canStart, stageState, isBusy, isStarting, start } =
    useCompanyImportStage(companyId, stage);

  if (!companyId || !canStart) return null;

  const isStageUnfinished =
    isBusy && !!stageState && unfinishedStageStatuses.includes(stageState.status);

  const handleClick = async () => {
    try {
      await start();
      toast.success(t("companyImport.toast.started"));
    } catch (error) {
      toast.error(t(String(error)));
    }
  };

  const label = isStageUnfinished
    ? t("companyImport.stageRunning")
    : t(`companyImport.startStage.${stage}`);

  return (
    <CustomButton
      variant={variant}
      fullWidth={false}
      loading={isStarting || isStageUnfinished}
      disabled={isBusy}
      onClick={handleClick}
      title={isBusy ? t("companyImport.busyHint") : undefined}
    >
      {label}
    </CustomButton>
  );
};

export default CompanyImportStageButton;
