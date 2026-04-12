import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import { Empty } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DeliveryTasksDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const taskId = id ?? '1';
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Heading title={t('deliveryTasks.detailsTitle')} subtitle={t('common.details')} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="detail-grid">
              <div className="detail-card">
                <h4>{t('deliveryTasks.sections.header')}</h4>
                <Empty description={t('deliveryTasks.details.headerEmpty')} />
              </div>
              <div className="detail-card">
                <h4>{t('deliveryTasks.sections.items')}</h4>
                <Empty description={t('deliveryTasks.details.itemsEmpty')} />
              </div>
              <div className="detail-card">
                <h4>{t('deliveryTasks.sections.session')}</h4>
                <Empty description={t('deliveryTasks.details.sessionEmpty')} />
                <CustomButton className="outline" onClick={() => navigate(`/delivery-tasks/${taskId}/scan`)}>
                  {t('deliveryTasks.actions.openScan')}
                </CustomButton>
              </div>
              <div className="detail-card">
                <h4>{t('deliveryTasks.sections.invoice')}</h4>
                <Empty description={t('deliveryTasks.details.invoiceEmpty')} />
              </div>
            </div>
            <div className="btns-group">
              <CustomButton className="outline" onClick={() => navigate('/delivery-tasks')}>
                {t('common.backToList')}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryTasksDetails;
