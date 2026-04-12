import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import DataMatrixScanner from 'shared/ui/dataMatrixScanner';
import CustomButton from 'shared/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DeliveryRoutesLoading = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const routeId = id ?? '1';
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Heading title={t('deliveryRoutes.loadingTitle')} subtitle={t('deliveryRoutes.loadingSubtitle')} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <DataMatrixScanner
              title={t('deliveryRoutes.loadingScannerTitle')}
              subtitle={t('deliveryRoutes.loadingScannerSubtitle', { id: routeId })}
              helperText={t('deliveryRoutes.loadingHelper')}
              primaryActionLabel={t('deliveryRoutes.actions.completeLoading')}
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

export default DeliveryRoutesLoading;
