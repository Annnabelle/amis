import type {
  CreateAggregatedCustomsCodeOrderDto,
  GetAggregatedCustomsCodesDto,
  SignAggregatedCustomsCodeOrderDto,
} from "@edem2000/amis.contracts/api/aggregated-customs-code/requests";
import type {
  CreateAggregatedCustomsCodeResponseDto,
  GetAggregatedCustomsCodeOrderResponseDto,
  InitiateAggregatedCustomsCodeOrderDissolutionResponseDto,
  SignDissolvementAggregatedCustomsCodeOrderResponseDto,
  SignRegistrationAggregatedCustomsCodeOrderResponseDto,
} from "@edem2000/amis.contracts/api/aggregated-customs-code/responses";
import { mapCustomsCodeOrderDtoToEntity } from "entities/customsCodes/mappers";
import type {
  CustomsCodeOrder,
  CustomsCodeOrderList,
} from "entities/customsCodes/types";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  toPaginated,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const listTag = [{ type: ApiTags.CustomsCodeOrder, id: LIST_TAG_ID }];

const orderTags = (order: CustomsCodeOrder | undefined) =>
  order
    ? [{ type: ApiTags.CustomsCodeOrder, id: order.id }, ...listTag]
    : listTag;

export const customsCodesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomsCodeOrders: build.query<
      CustomsCodeOrderList,
      GetAggregatedCustomsCodesDto
    >({
      query: (params) => request(endpointAccessMap.customsCodesList, { params }),
      transformResponse: toPaginated(mapCustomsCodeOrderDtoToEntity),
      providesTags: listTag,
    }),

    getCustomsCodeOrderById: build.query<CustomsCodeOrder, string>({
      query: (id) =>
        request(endpointAccessMap.customsCodesRead, { pathParams: { id } }),
      transformResponse: (
        response: SuccessOf<GetAggregatedCustomsCodeOrderResponseDto>
      ) => mapCustomsCodeOrderDtoToEntity(response.accOrder),
      providesTags: (_result, _error, id) => [
        { type: ApiTags.CustomsCodeOrder, id },
      ],
    }),

    createCustomsCodeOrder: build.mutation<
      CustomsCodeOrder,
      CreateAggregatedCustomsCodeOrderDto
    >({
      query: (data) => request(endpointAccessMap.customsCodesCreate, { data }),
      transformResponse: (
        response: SuccessOf<CreateAggregatedCustomsCodeResponseDto>
      ) => mapCustomsCodeOrderDtoToEntity(response.aggregatedCustomsCode),
      invalidatesTags: listTag,
    }),

    signCustomsCodeOrderRegistration: build.mutation<
      CustomsCodeOrder,
      SignAggregatedCustomsCodeOrderDto
    >({
      query: (data) =>
        request(endpointAccessMap.customsCodesSignRegistration, { data }),
      transformResponse: (
        response: SuccessOf<SignRegistrationAggregatedCustomsCodeOrderResponseDto>
      ) => mapCustomsCodeOrderDtoToEntity(response.aggregatedCustomsCode),
      invalidatesTags: (result) => orderTags(result),
    }),

    initiateCustomsCodeOrderDissolution: build.mutation<CustomsCodeOrder, string>({
      query: (id) =>
        request(endpointAccessMap.customsCodesInitiateDissolution, {
          pathParams: { id },
        }),
      transformResponse: (
        response: SuccessOf<InitiateAggregatedCustomsCodeOrderDissolutionResponseDto>
      ) => mapCustomsCodeOrderDtoToEntity(response.aggregatedCustomsCode),
      invalidatesTags: (_result, _error, id) => [
        { type: ApiTags.CustomsCodeOrder, id },
        ...listTag,
      ],
    }),

    signCustomsCodeOrderDissolution: build.mutation<
      CustomsCodeOrder,
      SignAggregatedCustomsCodeOrderDto
    >({
      query: (data) =>
        request(endpointAccessMap.customsCodesSignDissolution, { data }),
      transformResponse: (
        response: SuccessOf<SignDissolvementAggregatedCustomsCodeOrderResponseDto>
      ) => mapCustomsCodeOrderDtoToEntity(response.aggregatedCustomsCode),
      invalidatesTags: (result) => orderTags(result),
    }),
  }),
});

export const {
  useGetCustomsCodeOrdersQuery,
  useGetCustomsCodeOrderByIdQuery,
  useLazyGetCustomsCodeOrderByIdQuery,
  useCreateCustomsCodeOrderMutation,
  useSignCustomsCodeOrderRegistrationMutation,
  useInitiateCustomsCodeOrderDissolutionMutation,
  useSignCustomsCodeOrderDissolutionMutation,
} = customsCodesApi;
