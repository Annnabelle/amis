import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import ComponentTable from 'shared/ui/table';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getDeliveryRoutes } from 'entities/deliveryRoutes/model';
import { DeliveryRoutesTableColumns } from 'entities/deliveryRoutes/ui/tableData/deliveryRoutes';
import type { DeliveryRoutesTableDataType } from 'entities/deliveryRoutes/ui/tableData/deliveryRoutes/types';

const DeliveryRoutesList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();

  const routes = useAppSelector((state) => state.deliveryRoutes.routes);
  const dataTotal = useAppSelector((state) => state.deliveryRoutes.total);
  const isLoading = useAppSelector((state) => state.deliveryRoutes.isLoading);

  const createPath = orgId
    ? `/organization/${orgId}/delivery-routes/create`
    : '/delivery-routes/create';

  useEffect(() => {
    dispatch(
      getDeliveryRoutes({
        companyId: orgId,
      })
    );
  }, [dispatch, orgId]);

  const deliveryRoutesData = useMemo<DeliveryRoutesTableDataType[]>(() => {
    return routes.map((route) => ({
      key: route.id,
      routeNumber: route.routeNumber,
      status: route.status,
      routeDate: dayjs(route.schedule.routeDate).format('DD.MM.YYYY'),
      vehicleName: route.vehicle.name,
      plateNumber: route.vehicle.plateNumber || '-',
      driver: route.crew?.driverName || '-',
      agent: route.crew?.agentName || '-',
      taskCount: route.totals.taskCount,
      plannedQuantity: route.totals.plannedQuantity,
      loadedQuantity: route.totals.loadedQuantity,
      deliveredQuantity: route.totals.deliveredQuantity,
      returnedQuantity: route.totals.returnedQuantity,
      registeredAt: dayjs(route.timestamps.registeredAt).format('DD.MM.YYYY'),
    }));
  }, [routes]);

  return (
    <MainLayout>
      <Heading title={t('deliveryRoutes.title')} subtitle={t('common.total')} totalAmount={`${dataTotal}`}>
        <div className="btns-group">
          <CustomButton onClick={() => navigate(createPath)}>{t('deliveryRoutes.actions.create')}</CustomButton>
        </div>
      </Heading>
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <ComponentTable<DeliveryRoutesTableDataType>
              columns={DeliveryRoutesTableColumns(t)}
              data={deliveryRoutesData}
              loading={isLoading}
              onRowClick={(record) =>
                navigate(
                  orgId
                    ? `/organization/${orgId}/delivery-routes/${record.key}`
                    : `/delivery-routes/${record.key}`
                )
              }
              pagination={{
                pageSize: 10,
                total: dataTotal || routes.length,
                showSizeChanger: false,
                locale: { items_per_page: '' },
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryRoutesList;
