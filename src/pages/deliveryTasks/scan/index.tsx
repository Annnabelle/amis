import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import DataMatrixScanner from 'shared/ui/dataMatrixScanner';
import CustomButton from 'shared/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DeliveryTasksScan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const taskId = id ?? '1';
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Heading title={t('deliveryTasks.scanTitle')} subtitle={t('deliveryTasks.scanSubtitle')} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <DataMatrixScanner
              title={t('deliveryTasks.scanTitle')}
              subtitle={t('deliveryTasks.scanScannerSubtitle', { id: taskId })}
              helperText={t('deliveryTasks.scanHelper')}
              primaryActionLabel={t('deliveryTasks.actions.completeDelivery')}
              onPrimaryAction={() => navigate(`/delivery-tasks/${taskId}`)}
            />
            <div className="btns-group">
              <CustomButton className="outline" onClick={() => navigate(`/delivery-tasks/${taskId}`)}>
                {t('common.backToTask')}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryTasksScan;
