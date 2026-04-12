import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import DataMatrixScanner from 'shared/ui/dataMatrixScanner';
import CustomButton from 'shared/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DeliveryRoutesReturn = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const routeId = id ?? '1';
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Heading title={t('deliveryRoutes.returnTitle')} subtitle={t('deliveryRoutes.returnSubtitle')} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <DataMatrixScanner
              title={t('deliveryRoutes.returnScannerTitle')}
              subtitle={t('deliveryRoutes.returnScannerSubtitle', { id: routeId })}
              helperText={t('deliveryRoutes.returnHelper')}
              primaryActionLabel={t('deliveryRoutes.actions.completeReturn')}
              onPrimaryAction={() => navigate(`/delivery-routes/${routeId}`)}
            />
            <div className="btns-group">
              <CustomButton className="outline" onClick={() => navigate(`/delivery-routes/${routeId}`)}>
                {t('common.backToRoute')}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryRoutesReturn;
