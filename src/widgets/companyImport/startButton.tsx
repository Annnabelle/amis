import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCompanyImport } from "entities/companyImport/lib";
import CustomButton from "shared/ui/button";
import type { ButtonVariant } from "shared/ui/button";
import CompanyImportStartModal from "./startModal";

type CompanyImportStartButtonProps = {
  companyId?: string;
  variant?: ButtonVariant;
};

/**
 * Общий запуск импорта: выбор этапов живёт в модальном окне, потому что
 * запустить можно и весь конвейер, и один его этап.
 */
const CompanyImportStartButton = ({
  companyId,
  variant = "outline",
}: CompanyImportStartButtonProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { canStart, isActive, startingStages, start } = useCompanyImport(companyId);

  if (!companyId || !canStart) return null;

  return (
    <>
      <CustomButton
        variant={variant}
        fullWidth={false}
        disabled={isActive}
        loading={!!startingStages}
        onClick={() => setIsModalOpen(true)}
        title={isActive ? t("companyImport.busyHint") : undefined}
      >
        {isActive ? t("companyImport.running") : t("companyImport.start")}
      </CustomButton>

      <CompanyImportStartModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isStarting={!!startingStages}
        start={start}
      />
    </>
  );
};

export default CompanyImportStartButton;
