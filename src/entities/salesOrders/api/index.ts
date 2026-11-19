import type {
  CreateSalesOrderDto,
  GetSalesOrderDto,
  GetSalesOrdersDto,
} from "@edem2000/amis.contracts/api/sales-orders/requests";
import type {
  CreateSalesOrderResponseDto,
  GetSalesOrderResponseDto,
} from "@edem2000/amis.contracts/api/sales-orders/responses";
import { mapSalesOrderDtoToEntity } from "entities/salesOrders/mappers";
import type { SalesOrder, SalesOrderList } from "entities/salesOrders/types";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  toPaginated,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

export const salesOrdersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSalesOrders: build.query<SalesOrderList, GetSalesOrdersDto>({
      query: (params) => request(endpointAccessMap.salesOrdersList, { params }),
      transformResponse: toPaginated(mapSalesOrderDtoToEntity),
      providesTags: [{ type: ApiTags.SalesOrder, id: LIST_TAG_ID }],
    }),

    getSalesOrderById: build.query<SalesOrder, GetSalesOrderDto>({
      query: ({ id }) =>
        request(endpointAccessMap.salesOrdersRead, { pathParams: { id } }),
      transformResponse: (response: SuccessOf<GetSalesOrderResponseDto>) =>
        mapSalesOrderDtoToEntity(response.salesOrder),
      providesTags: (_result, _error, { id }) => [
        { type: ApiTags.SalesOrder, id },
      ],
    }),

    createSalesOrder: build.mutation<SalesOrder, CreateSalesOrderDto>({
      query: (data) => request(endpointAccessMap.salesOrdersCreate, { data }),
      transformResponse: (response: SuccessOf<CreateSalesOrderResponseDto>) =>
        mapSalesOrderDtoToEntity(response.salesOrder),
      invalidatesTags: [{ type: ApiTags.SalesOrder, id: LIST_TAG_ID }],
    }),
  }),
});

export const {
  useGetSalesOrdersQuery,
  useGetSalesOrderByIdQuery,
  useCreateSalesOrderMutation,
} = salesOrdersApi;
