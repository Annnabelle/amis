import type { CompleteDeliveryTaskHandoverDto } from "@edem2000/amis.contracts/api/delivery-tasks/requests";
import type {
  GetDeliveryTaskResponseDto,
  GetDeliveryTasksResponseDto,
} from "@edem2000/amis.contracts/api/delivery-tasks/responses";
import type { GetDeliveryTasksParams } from "entities/deliveryTasks/dtos";
import {
  mapDeliveryTaskDtoToEntity,
  mapDeliveryTasksDtoToEntities,
} from "entities/deliveryTasks/mappers";
import type { DeliveryTask } from "entities/deliveryTasks/types";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const toDeliveryTask = (response: SuccessOf<GetDeliveryTaskResponseDto>) =>
  mapDeliveryTaskDtoToEntity(response.deliveryTask);

export const deliveryTasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Список задач висит на маршруте рейса, а не на самой задаче. */
    getDeliveryTasks: build.query<DeliveryTask[], GetDeliveryTasksParams>({
      query: ({ routeId }) =>
        request(endpointAccessMap.deliveryRouteTasksList, {
          pathParams: { id: routeId },
        }),
      transformResponse: (response: SuccessOf<GetDeliveryTasksResponseDto>) =>
        mapDeliveryTasksDtoToEntities(response.data),
      providesTags: [{ type: ApiTags.DeliveryTask, id: LIST_TAG_ID }],
    }),

    getDeliveryTaskById: build.query<DeliveryTask, string>({
      query: (id) =>
        request(endpointAccessMap.deliveryTasksRead, { pathParams: { id } }),
      transformResponse: toDeliveryTask,
      providesTags: (_result, _error, id) => [
        { type: ApiTags.DeliveryTask, id },
      ],
    }),

    startDeliveryTaskHandover: build.mutation<DeliveryTask, string>({
      query: (id) =>
        request(endpointAccessMap.deliveryTasksStartHandover, {
          pathParams: { id },
        }),
      transformResponse: toDeliveryTask,
      invalidatesTags: (_result, _error, id) => [
        { type: ApiTags.DeliveryTask, id },
        { type: ApiTags.DeliveryTask, id: LIST_TAG_ID },
      ],
    }),

    completeDeliveryTaskHandover: build.mutation<
      DeliveryTask,
      { id: string; payload?: CompleteDeliveryTaskHandoverDto }
    >({
      query: ({ id, payload }) =>
        request(endpointAccessMap.deliveryTasksCompleteHandover, {
          pathParams: { id },
          data: payload ?? {},
        }),
      transformResponse: toDeliveryTask,
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.DeliveryTask, id },
        { type: ApiTags.DeliveryTask, id: LIST_TAG_ID },
      ],
    }),
  }),
});

export const {
  useGetDeliveryTasksQuery,
  useGetDeliveryTaskByIdQuery,
  useStartDeliveryTaskHandoverMutation,
  useCompleteDeliveryTaskHandoverMutation,
} = deliveryTasksApi;
