import type {
  GetVehiclesDto,
  UpdateVehicleDto,
  VerifyVehicleOwnershipDto,
} from "@edem2000/amis.contracts/api/vehicle/requests";
import type {
  GetVehicleResponseDto,
  VerifyVehicleOwnershipResponseDto,
} from "@edem2000/amis.contracts/api/vehicle/responses";
import type { CreateVehicleRequestDto } from "entities/vehicles/dtos";
import {
  mapVehicleDtoToEntity,
  mapVehicleOwnershipDtoToEntity,
} from "entities/vehicles/mappers";
import type {
  Vehicle,
  VehicleList,
  VehicleOwnership,
} from "entities/vehicles/types";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  toPaginated,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const toVehicle = (response: SuccessOf<GetVehicleResponseDto>): Vehicle =>
  mapVehicleDtoToEntity(response.transport);

export const vehiclesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVehicles: build.query<VehicleList, GetVehiclesDto | undefined>({
      query: (params) => request(endpointAccessMap.vehiclesList, { params }),
      transformResponse: toPaginated(mapVehicleDtoToEntity),
      providesTags: [{ type: ApiTags.Vehicle, id: LIST_TAG_ID }],
    }),

    getVehicleById: build.query<Vehicle, string>({
      query: (id) => request(endpointAccessMap.vehiclesRead, { pathParams: { id } }),
      transformResponse: toVehicle,
      providesTags: (_result, _error, id) => [{ type: ApiTags.Vehicle, id }],
    }),

    verifyVehicleOwnership: build.query<VehicleOwnership, VerifyVehicleOwnershipDto>({
      query: (params) =>
        request(endpointAccessMap.vehiclesVerifyOwnership, { params }),
      transformResponse: (
        response: SuccessOf<VerifyVehicleOwnershipResponseDto>
      ) => mapVehicleOwnershipDtoToEntity(response.ownership),
    }),

    createVehicle: build.mutation<Vehicle, CreateVehicleRequestDto>({
      query: (data) => request(endpointAccessMap.vehiclesCreate, { data }),
      transformResponse: toVehicle,
      invalidatesTags: [{ type: ApiTags.Vehicle, id: LIST_TAG_ID }],
    }),

    updateVehicle: build.mutation<Vehicle, { id: string; data: UpdateVehicleDto }>({
      query: ({ id, data }) =>
        request(endpointAccessMap.vehiclesUpdate, { pathParams: { id }, data }),
      transformResponse: toVehicle,
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.Vehicle, id },
        { type: ApiTags.Vehicle, id: LIST_TAG_ID },
      ],
    }),

    deleteVehicle: build.mutation<void, string>({
      query: (id) => request(endpointAccessMap.vehiclesDelete, { pathParams: { id } }),
      // Тело ответа не нужно: карточка и список перезапросятся по тегу.
      transformResponse: (): void => undefined,
      invalidatesTags: (_result, _error, id) => [
        { type: ApiTags.Vehicle, id },
        { type: ApiTags.Vehicle, id: LIST_TAG_ID },
      ],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetVehicleByIdQuery,
  useLazyVerifyVehicleOwnershipQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehiclesApi;
