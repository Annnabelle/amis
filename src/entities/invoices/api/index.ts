import type {
  GetInvoiceCodesDto,
  GetInvoiceDto,
  GetInvoiceItemsDto,
  GetInvoicesDto,
} from "@edem2000/amis.contracts/api/invoices/requests";
import type {
  GetInvoiceItemsResponseDto,
  GetInvoiceResponseDto,
} from "@edem2000/amis.contracts/api/invoices/responses";
import {
  mapInvoiceDtoToEntity,
  mapInvoiceItemDtoToEntity,
  mapInvoiceMarkingCodeDtoToEntity,
} from "entities/invoices/mappers";
import type {
  Invoice,
  InvoiceItemList,
  InvoiceList,
  InvoiceMarkingCodeList,
} from "entities/invoices/types";
import { baseApi, request, toPaginated, type SuccessOf } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

/** Контрактные GetInvoice*Dto описывают только query; id — часть пути. */
type GetInvoiceItemsParams = GetInvoiceItemsDto & { id: string };
type GetInvoiceCodesParams = GetInvoiceCodesDto & { id: string };

export const invoicesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getInvoices: build.query<InvoiceList, GetInvoicesDto>({
      query: (params) => request(endpointAccessMap.invoicesList, { params }),
      transformResponse: toPaginated(mapInvoiceDtoToEntity),
    }),

    getInvoiceById: build.query<Invoice, GetInvoiceDto>({
      query: ({ id }) =>
        request(endpointAccessMap.invoicesRead, { pathParams: { id } }),
      transformResponse: (response: SuccessOf<GetInvoiceResponseDto>) =>
        mapInvoiceDtoToEntity(response.invoice),
    }),

    getInvoiceItems: build.query<InvoiceItemList, GetInvoiceItemsParams>({
      query: ({ id, ...params }) =>
        request(endpointAccessMap.invoiceItemsRead, {
          pathParams: { id },
          params,
        }),
      // Маппер позиции требует id счёта, а он есть только в аргументе запроса.
      transformResponse: (
        response: SuccessOf<GetInvoiceItemsResponseDto>,
        _meta: unknown,
        { id }: GetInvoiceItemsParams
      ): InvoiceItemList => ({
        items: response.data.map((item) => mapInvoiceItemDtoToEntity(id, item)),
        total: response.total,
        page: response.page,
        limit: response.limit,
      }),
    }),

    getInvoiceCodes: build.query<InvoiceMarkingCodeList, GetInvoiceCodesParams>({
      query: ({ id, ...params }) =>
        request(endpointAccessMap.invoiceCodesRead, {
          pathParams: { id },
          params,
        }),
      transformResponse: toPaginated(mapInvoiceMarkingCodeDtoToEntity),
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useGetInvoiceItemsQuery,
  useGetInvoiceCodesQuery,
} = invoicesApi;
