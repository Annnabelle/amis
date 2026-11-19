import type {
  CreateSystemEmployeeDto,
  GetSystemEmployeesDto,
  UpdateSystemEmployeeDto,
} from "@edem2000/amis.contracts/api/employees/requests";
import type {
  CreateSystemEmployeeAccessResponseDto,
  GetSystemEmployeeResponseDto,
  UpdateSystemEmployeeAccessResponseDto,
} from "@edem2000/amis.contracts/api/employees/responses";
import {
  mapSystemEmployeeAccessDtoToEntity,
  mapSystemEmployeeDtoToEntity,
} from "entities/systemEmployees/mappers";
import type {
  SystemEmployee,
  SystemEmployeeAccess,
  SystemEmployeeList,
  SystemEmployeeListQuery,
} from "entities/systemEmployees/types";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  toPaginated,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const listTag = [{ type: ApiTags.SystemEmployee, id: LIST_TAG_ID }];

export const systemEmployeesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSystemEmployees: build.query<SystemEmployeeList, SystemEmployeeListQuery>({
      query: (params) =>
        request(endpointAccessMap.systemEmployeesList, {
          params: params as GetSystemEmployeesDto,
        }),
      transformResponse: toPaginated(mapSystemEmployeeDtoToEntity),
      providesTags: listTag,
    }),

    getSystemEmployeeById: build.query<SystemEmployee, { id: string }>({
      query: ({ id }) =>
        request(endpointAccessMap.systemEmployeesRead, { pathParams: { id } }),
      transformResponse: (response: SuccessOf<GetSystemEmployeeResponseDto>) =>
        mapSystemEmployeeDtoToEntity(response.data),
      providesTags: (_result, _error, { id }) => [
        { type: ApiTags.SystemEmployee, id },
      ],
    }),

    createSystemEmployeeInvitation: build.mutation<
      SystemEmployeeAccess,
      CreateSystemEmployeeDto
    >({
      query: (data) =>
        request(endpointAccessMap.systemEmployeesCreate, { data }),
      transformResponse: (
        response: SuccessOf<CreateSystemEmployeeAccessResponseDto>
      ) => mapSystemEmployeeAccessDtoToEntity(response.data),
      invalidatesTags: listTag,
    }),

    updateSystemEmployeeRoles: build.mutation<
      SystemEmployeeAccess,
      { id: string; data: UpdateSystemEmployeeDto }
    >({
      query: ({ id, data }) =>
        request(endpointAccessMap.systemEmployeesUpdate, {
          pathParams: { id },
          data,
        }),
      transformResponse: (
        response: SuccessOf<UpdateSystemEmployeeAccessResponseDto>
      ) => mapSystemEmployeeAccessDtoToEntity(response.data),
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.SystemEmployee, id },
        ...listTag,
      ],
    }),

    deleteSystemEmployee: build.mutation<void, { id: string }>({
      query: ({ id }) =>
        request(endpointAccessMap.systemEmployeesDelete, { pathParams: { id } }),
      transformResponse: (): void => undefined,
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.SystemEmployee, id },
        ...listTag,
      ],
    }),
  }),
});

export const {
  useGetSystemEmployeesQuery,
  useGetSystemEmployeeByIdQuery,
  useCreateSystemEmployeeInvitationMutation,
  useUpdateSystemEmployeeRolesMutation,
  useDeleteSystemEmployeeMutation,
} = systemEmployeesApi;
