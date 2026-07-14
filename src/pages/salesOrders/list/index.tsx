import { useMemo, useEffect } from 'react';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import ComponentTable from 'shared/ui/table';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getSalesOrders } from 'entities/salesOrders/model';
import { SalesOrdersTableColumns } from 'entities/salesOrders/ui/tableData/salesOrders';
import type { SalesOrdersTableDataType } from 'entities/salesOrders/ui/tableData/salesOrders/types';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

const SalesOrdersList = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const canCreateSalesOrder = useCan(endpointAccessMap.salesOrdersCreate
  );
  const canReadSalesOrder = useCan(endpointAccessMap.salesOrdersRead
  );
  const orders = useAppSelector((state) => state.salesOrders.orders);
  const dataLimit = useAppSelector((state) => state.salesOrders.limit);
  const dataPage = useAppSelector((state) => state.salesOrders.page);
  const dataTotal = useAppSelector((state) => state.salesOrders.total);
  const isLoading = useAppSelector((state) => state.salesOrders.isLoading);
  const createPath = orgId
    ? `/organization/${orgId}/sales-orders/create`
    : '/organization';

  useEffect(() => {
    dispatch(
      getSalesOrders({
        page: dataPage || 1,
        limit: dataLimit || 10,
        sortOrder: 'desc',
      })
    );
  }, [dispatch, dataPage, dataLimit, orgId]);

  const SalesOrdersData = useMemo<SalesOrdersTableDataType[]>(() => {
    return orders.map((order) => ({
      key: order.id,
      orderNumber: order.salesOrderNumber,
      customerName: order.customer.name,
      customerTin: order.customer.tin,
      dueDate: order.fulfillment.dueDate
        ? dayjs(order.fulfillment.dueDate).format('DD.MM.YYYY')
        : '-',
      priority: t(`salesOrders.priority.${order.fulfillment.priority}`),
      priorityKey: order.fulfillment.priority,
      orderedQuantity: order.totals.orderedQuantity ?? 0,
      deliveredQuantity: order.totals.deliveredQuantity ?? 0,
      status: order.status,
    }));
  }, [orders, t]);
  
  return (
    <MainLayout>
      <Heading title={t('salesOrders.title')} subtitle={t('common.total')} totalAmount={`${dataTotal}`}>
        {canCreateSalesOrder && (
          <div className="btns-group">
            <CustomButton onClick={() => navigate(createPath)}>
              {t('salesOrders.create')}
            </CustomButton>
          </div>
        )}
      </Heading>
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <ComponentTable<SalesOrdersTableDataType>
              columns={SalesOrdersTableColumns(t, orgId)}
              data={SalesOrdersData}
              loading={isLoading}
              onRowClick={
                canReadSalesOrder
                  ? (record) =>
                      navigate(
                        orgId
                          ? `/organization/${orgId}/sales-orders/${record.key}`
                          : '/organization'
                      )
                  : undefined
              }
              pagination={{
                current: dataPage || 1,
                pageSize: dataLimit || 10,
                total: dataTotal || 0,
                showSizeChanger: { showSearch: false },
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                locale: { items_per_page: '' },
                onChange: (newPage, newLimit) => {
                  dispatch(
                    getSalesOrders({
                      page: newPage,
                      limit: newLimit || dataLimit || 10,
                      sortOrder: 'desc',
                    })
                  );
                },
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SalesOrdersList;
