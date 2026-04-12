import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import { Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const InvoicesDetails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Heading title={t('invoices.detailsTitle')} subtitle={t('common.details')} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="detail-grid">
              <div className="detail-card">
                <h4>{t('invoices.sections.header')}</h4>
                <Empty description={t('invoices.details.headerEmpty')} />
              </div>
              <div className="detail-card">
                <h4>{t('invoices.sections.links')}</h4>
                <Empty description={t('invoices.details.linksEmpty')} />
              </div>
              <div className="detail-card">
                <h4>{t('invoices.sections.items')}</h4>
                <Empty description={t('invoices.details.itemsEmpty')} />
              </div>
            </div>
            <div className="btns-group">
              <CustomButton className="outline" onClick={() => navigate('/invoices')}>
                {t('common.backToList')}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InvoicesDetails;
