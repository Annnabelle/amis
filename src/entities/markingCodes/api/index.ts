import type { GetBatchCodesParamDto } from "@edem2000/amis.contracts/api/codes/requests";
import type { GetOrderProductCodesResponseDto } from "@edem2000/amis.contracts/api/codes/responses";
import type {
  CreateOrderDto,
  GetBatchDto,
  GetOrderDto,
} from "@edem2000/amis.contracts/api/orders/requests";
import type {
  CreateOrderResponseDto,
  GetBatchResponseDto,
  GetOrderResponseDto,
} from "@edem2000/amis.contracts/api/orders/responses";
import type { OrderListQueryRequestDto } from "entities/markingCodes/dtos";
import {
  mapBatchesDtoToEntity,
  mapCodeRowDtoToEntity,
  mapMarkingCodeDtoToEntity,
  mapMarkingCodesDtoToEntity,
} from "entities/markingCodes/mappers";
import type {
  Batch,
  Order,
  OrderBatchList,
} from "entities/markingCodes/types";
import type { OrderProductCodes } from "entities/markingCodes/types/order-product";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  toPaginated,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const listTag = [{ type: ApiTags.MarkingCodeOrder, id: LIST_TAG_ID }];

export const markingCodesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Список заказов на коды: строка списка — партия внутри заказа. */
    getMarkingCodeOrders: build.query<OrderBatchList, OrderListQueryRequestDto>({
      query: (params) => request(endpointAccessMap.ordersList, { params }),
      transformResponse: toPaginated(mapMarkingCodesDtoToEntity),
      providesTags: listTag,
    }),

    getMarkingCodeOrderById: build.query<Order, GetOrderDto>({
      query: ({ id }) =>
        request(endpointAccessMap.ordersRead, { pathParams: { id } }),
      transformResponse: (response: SuccessOf<GetOrderResponseDto>) =>
        mapMarkingCodeDtoToEntity(response.order),
      providesTags: (_result, _error, { id }) => [
        { type: ApiTags.MarkingCodeOrder, id },
      ],
    }),

    getOrderBatch: build.query<Batch, GetBatchDto>({
      query: ({ orderId, batchId }) =>
        request(endpointAccessMap.orderBatchRead, {
          pathParams: { orderId, batchId },
        }),
      transformResponse: (response: SuccessOf<GetBatchResponseDto>) =>
        mapBatchesDtoToEntity(response.batch),
      providesTags: (_result, _error, { batchId }) => [
        { type: ApiTags.MarkingCodeOrder, id: batchId },
      ],
    }),

    getOrderProductCodes: build.query<OrderProductCodes, GetBatchCodesParamDto>({
      query: (params) => request(endpointAccessMap.codesRead, { params }),
      transformResponse: (
        response: SuccessOf<GetOrderProductCodesResponseDto>
      ): OrderProductCodes => ({
        data: response.data.map(mapCodeRowDtoToEntity),
        total: response.total,
        page: response.page,
        limit: response.limit,
      }),
    }),

    createMarkingCodeOrder: build.mutation<Order, CreateOrderDto>({
      query: (data) => request(endpointAccessMap.ordersCreate, { data }),
      transformResponse: (response: SuccessOf<CreateOrderResponseDto>) =>
        mapMarkingCodeDtoToEntity(response.order),
      invalidatesTags: listTag,
    }),
  }),
});

export const {
  useGetMarkingCodeOrdersQuery,
  useGetMarkingCodeOrderByIdQuery,
  useGetOrderBatchQuery,
  useGetOrderProductCodesQuery,
  useCreateMarkingCodeOrderMutation,
} = markingCodesApi;
