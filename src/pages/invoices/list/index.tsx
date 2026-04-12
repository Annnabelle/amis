import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

const InvoicesList = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Heading title={t('invoices.title')} subtitle={t('common.total')} totalAmount="0" />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <Empty description={t('invoices.listEmpty')} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InvoicesList;
