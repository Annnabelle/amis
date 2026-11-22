import { useMemo, useState } from 'react';
import { DEFAULT_PAGINATION } from 'shared/config/pagination';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetInvoicesQuery } from 'entities/invoices/api';
import { InvoicesTableColumns } from 'entities/invoices/ui/tableData/invoices';
import type { InvoicesTableDataType } from 'entities/invoices/ui/tableData/invoices/types';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import ComponentTable from 'shared/ui/table';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

const InvoicesList = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const canReadInvoice = useCan(endpointAccessMap.invoicesRead);

  const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
  const { data: invoicesPage, isFetching: isLoading } = useGetInvoicesQuery(
    {
      page: pagination.page,
      limit: pagination.limit,
      sortOrder: 'desc',
      sortBy: 'createdAt',
    },
    { skip: !orgId }
  );
  const invoices = useMemo(() => invoicesPage?.items ?? [], [invoicesPage]);
  const dataPage = pagination.page;
  const dataLimit = pagination.limit;
  const dataTotal = invoicesPage?.total ?? 0;

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

  const columns = useMemo(() => InvoicesTableColumns(t, orgId), [orgId, t]);

  return (
    <MainLayout>
      <Heading title={t('invoices.title')} subtitle={t('common.total')} totalAmount={`${dataTotal}`} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <ComponentTable<InvoicesTableDataType>
              columns={columns}
              data={invoicesData}
              loading={isLoading}
              scroll={false}
              onRowClick={
                canReadInvoice
                  ? (record) =>
                      navigate(
                        orgId
                          ? `/organization/${orgId}/invoices/${record.key}`
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

export default InvoicesList;
