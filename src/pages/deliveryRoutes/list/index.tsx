import { useMemo } from 'react';
import MainLayout from 'widgets/appShell';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import ComponentTable from 'shared/ui/table';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetDeliveryRoutesQuery } from 'entities/deliveryRoutes/api';
import { DeliveryRoutesTableColumns } from 'entities/deliveryRoutes/ui/tableData/deliveryRoutes';
import type { DeliveryRoutesTableDataType } from 'entities/deliveryRoutes/ui/tableData/deliveryRoutes/types';
import { useIsMobile } from 'shared/lib';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

import { formatDate } from 'shared/lib/formatDate';
const DeliveryRoutesList = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const canCreateRoute = useCan(endpointAccessMap.deliveryRoutesCreate);
  const canReadRoute = useCan(endpointAccessMap.deliveryRoutesRead);

  const { data: routes = [], isFetching: isLoading } = useGetDeliveryRoutesQuery(
    {},
    { skip: !orgId }
  );
  const dataTotal = routes.length;

  const createPath = orgId
    ? `/organization/${orgId}/delivery-routes/create`
    : '/organization';

  const deliveryRoutesData = useMemo<DeliveryRoutesTableDataType[]>(() => {
    return routes.map((route) => ({
      key: route.id,
      routeNumber: route.routeNumber,
      status: route.status,
      routeDate: formatDate(route.schedule.routeDate),
      vehicleName: route.vehicle.name,
      plateNumber: route.vehicle.plateNumber || '-',
      driver: route.crew?.driverName || '-',
      agent: route.crew?.agentName || '-',
      taskCount: route.totals.taskCount,
      plannedQuantity: route.totals.plannedQuantity,
      loadedQuantity: route.totals.loadedQuantity,
      deliveredQuantity: route.totals.deliveredQuantity,
      returnedQuantity: route.totals.returnedQuantity,
      registeredAt: formatDate(route.timestamps.registeredAt),
    }));
  }, [routes]);

  const columns = useMemo(() => DeliveryRoutesTableColumns(t), [t]);

  return (
    <MainLayout>
      {!isMobile && (
      <>
      <Heading title={t('deliveryRoutes.title')} subtitle={t('common.total')} totalAmount={`${dataTotal}`}>
        {canCreateRoute && (
          <div className="btns-group">
            <CustomButton onClick={() => navigate(createPath)}>{t('deliveryRoutes.actions.create')}</CustomButton>
          </div>
        )}
      </Heading>
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <ComponentTable<DeliveryRoutesTableDataType>
              columns={columns}
              data={deliveryRoutesData}
              loading={isLoading}
              onRowClick={
                canReadRoute
                  ? (record) =>
                      navigate(
                        orgId
                          ? `/organization/${orgId}/delivery-routes/${record.key}`
                          : '/organization'
                      )
                  : undefined
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
      </>
      )}
    </MainLayout>
  );
};

export default DeliveryRoutesList;
