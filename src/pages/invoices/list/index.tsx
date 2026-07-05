import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getInvoices } from 'entities/invoices/model';
import { InvoicesTableColumns } from 'entities/invoices/ui/tableData/invoices';
import type { InvoicesTableDataType } from 'entities/invoices/ui/tableData/invoices/types';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import ComponentTable from 'shared/ui/table';

const InvoicesList = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const invoices = useAppSelector((state) => state.invoices.invoices);
  const dataLimit = useAppSelector((state) => state.invoices.limit);
  const dataPage = useAppSelector((state) => state.invoices.page);
  const dataTotal = useAppSelector((state) => state.invoices.total);
  const isLoading = useAppSelector((state) => state.invoices.isLoading);

  useEffect(() => {
    dispatch(
      getInvoices({
        page: dataPage || 1,
        limit: dataLimit || 10,
        sortOrder: 'desc',
        sortBy: 'createdAt',
        companyId: orgId,
      })
    );
  }, [dispatch, dataPage, dataLimit, orgId]);

  const invoicesData = useMemo<InvoicesTableDataType[]>(() => {
    return invoices.map((invoice) => ({
      key: invoice.id,
      invoiceNumber: invoice.invoiceNumber || invoice.invoice.number || invoice.id,
      invoiceDate: dayjs(invoice.invoice.date).format('DD.MM.YYYY'),
      senderName: invoice.sender.name || '-',
      receiverName: invoice.receiver.name || '-',
      amountWithoutVat: invoice.totals.amountWithoutVat.toLocaleString(),
      itemsQuantity: invoice.totals.itemsQuantity ?? 0,
      unitsQuantity: invoice.totals.unitsQuantity ?? 0,
      externalStatus: invoice.external?.status || '-',
      status: invoice.status,
      createdAt: dayjs(invoice.createdAt).format('DD.MM.YYYY'),
    }));
  }, [invoices]);

  return (
    <MainLayout>
      <Heading title={t('invoices.title')} subtitle={t('common.total')} totalAmount={`${dataTotal}`} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <ComponentTable<InvoicesTableDataType>
              columns={InvoicesTableColumns(t, orgId)}
              data={invoicesData}
              loading={isLoading}
              scroll={false}
              onRowClick={(record) =>
                navigate(
                  orgId
                    ? `/organization/${orgId}/invoices/${record.key}`
                    : `/invoices/${record.key}`
                )
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
                    getInvoices({
                      page: newPage,
                      limit: newLimit || dataLimit || 10,
                      sortOrder: 'desc',
                      sortBy: 'createdAt',
                      companyId: orgId,
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

export default InvoicesList;
