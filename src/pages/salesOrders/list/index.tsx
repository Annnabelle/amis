import { useMemo, useState } from 'react';
import { DEFAULT_PAGINATION } from 'shared/config/pagination';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import ComponentTable from 'shared/ui/table';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetSalesOrdersQuery } from 'entities/salesOrders/api';
import { SalesOrdersTableColumns } from 'entities/salesOrders/ui/tableData/salesOrders';
import type { SalesOrdersTableDataType } from 'entities/salesOrders/ui/tableData/salesOrders/types';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

import { formatDate } from 'shared/lib/formatDate';
const SalesOrdersList = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const canCreateSalesOrder = useCan(endpointAccessMap.salesOrdersCreate
  );
  const canReadSalesOrder = useCan(endpointAccessMap.salesOrdersRead
  );
  const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
  const { data: ordersPage, isFetching: isLoading } = useGetSalesOrdersQuery(
    { page: pagination.page, limit: pagination.limit, sortOrder: 'desc' },
    { skip: !orgId }
  );
  const orders = useMemo(() => ordersPage?.items ?? [], [ordersPage]);
  const dataPage = pagination.page;
  const dataLimit = pagination.limit;
  const dataTotal = ordersPage?.total ?? 0;
  const createPath = orgId
    ? `/organization/${orgId}/sales-orders/create`
    : '/organization';

  const SalesOrdersData = useMemo<SalesOrdersTableDataType[]>(() => {
    return orders.map((order) => ({
      key: order.id,
      orderNumber: order.salesOrderNumber,
      customerName: order.customer.name,
      customerTin: order.customer.tin,
      dueDate: order.fulfillment.dueDate
        ? formatDate(order.fulfillment.dueDate)
        : '-',
      priority: t(`salesOrders.priority.${order.fulfillment.priority}`),
      priorityKey: order.fulfillment.priority,
      orderedQuantity: order.totals.orderedQuantity ?? 0,
      deliveredQuantity: order.totals.deliveredQuantity ?? 0,
      status: order.status,
    }));
  }, [orders, t]);
  
  const columns = useMemo(() => SalesOrdersTableColumns(t, orgId), [orgId, t]);

  
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
              columns={columns}
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
                onChange: (newPage, newLimit) =>
                  setPagination((prev) => ({
                    page: newPage,
                    limit: newLimit || prev.limit,
                  })),
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SalesOrdersList;
