import { useMemo, useEffect, useState } from 'react';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import ComponentTable from 'shared/ui/table';
import ModalWindow from 'shared/ui/modalWindow';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from 'app/store';
import { deleteSalesOrder, getSalesOrders } from 'entities/salesOrders/model';
import { SalesOrdersTableColumns } from 'entities/salesOrders/ui/tableData/salesOrders';
import type { SalesOrdersTableDataType } from 'entities/salesOrders/ui/tableData/salesOrders/types';
import { toast } from 'react-toastify';

const SalesOrdersList = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.salesOrders.orders);
  const dataLimit = useAppSelector((state) => state.salesOrders.limit);
  const dataPage = useAppSelector((state) => state.salesOrders.page);
  const dataTotal = useAppSelector((state) => state.salesOrders.total);
  const isLoading = useAppSelector((state) => state.salesOrders.isLoading);
  const createPath = orgId
    ? `/organization/${orgId}/sales-orders/create`
    : '/sales-orders/create';

  useEffect(() => {
    dispatch(
      getSalesOrders({
        page: dataPage || 1,
        limit: dataLimit || 10,
        sortOrder: 'asc',
        companyId: orgId,
      })
    );
  }, [dispatch, dataPage, dataLimit, orgId]);

  const SalesOrdersData = useMemo<SalesOrdersTableDataType[]>(() => {
    return orders.map((order) => ({
      key: order.id,
      orderNumber: order.contract?.number ?? order.id,
      customerName: order.customer.name,
      customerTin: order.customer.tin,
      dueDate: order.fulfillment.dueDate
        ? dayjs(order.fulfillment.dueDate).format('DD.MM.YYYY')
        : '-',
      priority: t(`salesOrders.priority.${order.fulfillment.priority}`),
      orderedQuantity: order.totals.orderedQuantity ?? 0,
      deliveredQuantity: order.totals.deliveredQuantity ?? 0,
      status: order.status,
    }));
  }, [orders, t]);
  
  const [modalState, setModalState] = useState<{
    deleteOrder: boolean;
    orderData: SalesOrdersTableDataType | null;
  }>({
    deleteOrder: false,
    orderData: null,
  });

  const confirmDelete = async () => {
    if (!modalState.orderData) return;
    try {
      await dispatch(deleteSalesOrder({ id: modalState.orderData.key })).unwrap();
      toast.success(t('salesOrders.messages.success.delete'));
      setModalState({ deleteOrder: false, orderData: null });
      dispatch(
        getSalesOrders({
          page: dataPage || 1,
          limit: dataLimit || 10,
          sortOrder: 'asc',
          companyId: orgId,
        })
      );
    } catch (err) {
      toast.error(t('salesOrders.messages.error.delete'));
    }
  };

  return (
    <MainLayout>
      <Heading title={t('salesOrders.title')} subtitle={t('common.total')} totalAmount={`${dataTotal}`}>
        <div className="btns-group">
          <CustomButton onClick={() => navigate(createPath)}>{t('salesOrders.create')}</CustomButton>
        </div>
      </Heading>
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <ComponentTable<SalesOrdersTableDataType>
              columns={SalesOrdersTableColumns(t, orgId)}
              data={SalesOrdersData}
              loading={isLoading}
              onRowClick={(record) =>
                navigate(
                  orgId
                    ? `/organization/${orgId}/sales-orders/${record.key}`
                    : `/sales-orders/${record.key}`
                )
              }
              pagination={{
                current: dataPage || 1,
                pageSize: dataLimit || 10,
                total: dataTotal || 0,
                showSizeChanger: { showSearch: false },
                pageSizeOptions: ['10', '15', '20', '25'],
                locale: { items_per_page: '' },
                onChange: (newPage, newLimit) => {
                  dispatch(
                    getSalesOrders({
                      page: newPage,
                      limit: newLimit || dataLimit || 10,
                      sortOrder: 'asc',
                      companyId: orgId,
                    })
                  );
                },
              }}
            />
          </div>
        </div>
      </div>
      <ModalWindow
        titleAction={t('salesOrders.modalWindow.deletion')}
        title={t('salesOrders.modalWindow.order')}
        openModal={modalState.deleteOrder}
        closeModal={() => setModalState({ deleteOrder: false, orderData: null })}
        classDangerName="danger-title"
      >
        <div className="delete-modal">
          <div className="delete-modal-title">
            <p className="title">{t('salesOrders.deleteQuestion')}: </p>
            <p className="subtitle">{modalState.orderData?.orderNumber} ?</p>
          </div>
          <div className="delete-modal-btns">
            <CustomButton className="danger" onClick={confirmDelete}>
              {t('btn.delete')}
            </CustomButton>
            <CustomButton
              onClick={() => setModalState({ deleteOrder: false, orderData: null })}
              className="outline"
            >
              {t('btn.cancel')}
            </CustomButton>
          </div>
        </div>
      </ModalWindow>
    </MainLayout>
  );
};

export default SalesOrdersList;
