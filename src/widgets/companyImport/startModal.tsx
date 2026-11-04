import { Checkbox } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  selectableCompanyImportStages,
  type CompanyImportStage,
} from "entities/companyImport/types";
import CustomButton from "shared/ui/button";
import ModalWindow from "shared/ui/modalWindow";

type CompanyImportStartModalProps = {
  open: boolean;
  onClose: () => void;
  isStarting: boolean;
  start: (stages?: CompanyImportStage[]) => Promise<void>;
};

/**
 * Выбор этапов перед запуском. Выбран весь конвейер — отправляем запрос без
 * stages: так сервер сам решает, из чего он состоит.
 */
const CompanyImportStartModal = ({
  open,
  onClose,
  isStarting,
  start,
}: CompanyImportStartModalProps) => {
  const { t } = useTranslation();
  const [stages, setStages] = useState<CompanyImportStage[]>([
    ...selectableCompanyImportStages,
  ]);

  const isWholePipeline = stages.length === selectableCompanyImportStages.length;

  const handleStart = async () => {
    try {
      await start(isWholePipeline ? undefined : stages);
      toast.success(t("companyImport.toast.started"));
      onClose();
    } catch (error) {
      toast.error(t(String(error)));
    }
  };

  return (
    <ModalWindow
      openModal={open}
      closeModal={onClose}
      title={t("companyImport.startModal.title")}
    >
      <div className="company-import-start">
        <p className="company-import-start-hint">
          {t("companyImport.startModal.hint")}
        </p>

        <Checkbox.Group
          className="company-import-start-stages"
          value={stages}
          onChange={(checked) => setStages(checked as CompanyImportStage[])}
          options={selectableCompanyImportStages.map((stage) => ({
            label: (
              <span className="company-import-start-stage">
                <span className="company-import-start-stage-title">
                  {t(`companyImport.stages.${stage}`)}
                </span>
                <span className="company-import-start-stage-hint">
                  {t(`companyImport.stageHints.${stage}`)}
                </span>
              </span>
            ),
            value: stage,
          }))}
        />

        <div className="company-import-start-actions">
          <CustomButton variant="outline" onClick={onClose} disabled={isStarting}>
            {t("btn.cancel")}
          </CustomButton>
          <CustomButton
            onClick={handleStart}
            loading={isStarting}
            disabled={stages.length === 0}
          >
            {t("companyImport.startModal.submit")}
          </CustomButton>
        </div>
      </div>
    </ModalWindow>
  );
};

export default CompanyImportStartModal;
