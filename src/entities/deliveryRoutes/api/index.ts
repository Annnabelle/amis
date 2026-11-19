import type {
  CompleteDeliveryRouteLoadingDto,
  GetDeliveryRoutesDto,
} from "@edem2000/amis.contracts/api/delivery-routes/requests";
import type {
  CreateDeliveryRouteResponseDto,
  GetDeliveryRouteResponseDto,
  GetDeliveryRoutesResponseDto,
} from "@edem2000/amis.contracts/api/delivery-routes/responses";
import type { CreateDeliveryRouteRequestDto } from "entities/deliveryRoutes/dtos";
import { mapDeliveryRouteDtoToEntity } from "entities/deliveryRoutes/mappers";
import type { DeliveryRoute } from "entities/deliveryRoutes/types";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const toDeliveryRoute = (response: SuccessOf<GetDeliveryRouteResponseDto>) =>
  mapDeliveryRouteDtoToEntity(response.deliveryRoute);

const routeTags = (id: string) => [
  { type: ApiTags.DeliveryRoute, id },
  { type: ApiTags.DeliveryRoute, id: LIST_TAG_ID },
  // Переход рейса меняет и его задачи: статус выдачи считается по рейсу.
  { type: ApiTags.DeliveryTask, id: LIST_TAG_ID },
];

export const deliveryRoutesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Список приходит без постраничности: бэкенд отдаёт только data. */
    getDeliveryRoutes: build.query<DeliveryRoute[], GetDeliveryRoutesDto>({
      query: (params) =>
        request(endpointAccessMap.deliveryRoutesList, { params }),
      transformResponse: (response: SuccessOf<GetDeliveryRoutesResponseDto>) =>
        response.data.map(mapDeliveryRouteDtoToEntity),
      providesTags: [{ type: ApiTags.DeliveryRoute, id: LIST_TAG_ID }],
    }),

    getDeliveryRouteById: build.query<DeliveryRoute, string>({
      query: (id) =>
        request(endpointAccessMap.deliveryRoutesRead, { pathParams: { id } }),
      transformResponse: toDeliveryRoute,
      providesTags: (_result, _error, id) => [
        { type: ApiTags.DeliveryRoute, id },
      ],
    }),

    createDeliveryRoute: build.mutation<DeliveryRoute, CreateDeliveryRouteRequestDto>({
      query: (data) => request(endpointAccessMap.deliveryRoutesCreate, { data }),
      transformResponse: (response: SuccessOf<CreateDeliveryRouteResponseDto>) =>
        mapDeliveryRouteDtoToEntity(response.deliveryRoute),
      invalidatesTags: [{ type: ApiTags.DeliveryRoute, id: LIST_TAG_ID }],
    }),

    startDeliveryRouteLoading: build.mutation<DeliveryRoute, string>({
      query: (id) =>
        request(endpointAccessMap.deliveryRoutesStartLoading, {
          pathParams: { id },
        }),
      transformResponse: toDeliveryRoute,
      invalidatesTags: (_result, _error, id) => routeTags(id),
    }),

    completeDeliveryRouteLoading: build.mutation<
      DeliveryRoute,
      { id: string; payload?: CompleteDeliveryRouteLoadingDto }
    >({
      query: ({ id, payload }) =>
        request(endpointAccessMap.deliveryRoutesCompleteLoading, {
          pathParams: { id },
          data: payload ?? {},
        }),
      transformResponse: toDeliveryRoute,
      invalidatesTags: (_result, _error, { id }) => routeTags(id),
    }),

    startDeliveryRouteTransit: build.mutation<DeliveryRoute, string>({
      query: (id) =>
        request(endpointAccessMap.deliveryRoutesStartTransit, {
          pathParams: { id },
        }),
      transformResponse: toDeliveryRoute,
      invalidatesTags: (_result, _error, id) => routeTags(id),
    }),

    startDeliveryRouteReturn: build.mutation<DeliveryRoute, string>({
      query: (id) =>
        request(endpointAccessMap.deliveryRoutesStartReturn, {
          pathParams: { id },
        }),
      transformResponse: toDeliveryRoute,
      invalidatesTags: (_result, _error, id) => routeTags(id),
    }),

    completeDeliveryRouteReturn: build.mutation<DeliveryRoute, string>({
      query: (id) =>
        request(endpointAccessMap.deliveryRoutesCompleteReturn, {
          pathParams: { id },
        }),
      transformResponse: toDeliveryRoute,
      invalidatesTags: (_result, _error, id) => routeTags(id),
    }),

    closeDeliveryRoute: build.mutation<DeliveryRoute, string>({
      query: (id) =>
        request(endpointAccessMap.deliveryRoutesClose, { pathParams: { id } }),
      transformResponse: toDeliveryRoute,
      invalidatesTags: (_result, _error, id) => routeTags(id),
    }),
  }),
});

export const {
  useGetDeliveryRoutesQuery,
  useGetDeliveryRouteByIdQuery,
  useCreateDeliveryRouteMutation,
  useStartDeliveryRouteLoadingMutation,
  useCompleteDeliveryRouteLoadingMutation,
  useStartDeliveryRouteTransitMutation,
  useStartDeliveryRouteReturnMutation,
  useCompleteDeliveryRouteReturnMutation,
  useCloseDeliveryRouteMutation,
} = deliveryRoutesApi;
