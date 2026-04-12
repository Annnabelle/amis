import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

const DeliveryTasksList = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Heading title={t('deliveryTasks.title')} subtitle={t('deliveryTasks.subtitle')} totalAmount="0" />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <Empty description={t('deliveryTasks.listEmpty')} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryTasksList;
