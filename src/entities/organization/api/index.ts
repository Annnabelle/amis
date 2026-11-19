import type {
  ActivateCompanyDto,
  DeleteCompanyDto,
  GetCompaniesDto,
  GetCompanyDto,
  UpdateCompanyDto,
} from "@edem2000/amis.contracts/api/companies/requests";
import type {
  ActivateCompanyResponseDto,
  GetCompanyByTinResponseDto,
  GetCompanyResponseDto,
  UpdateCompanyResponseDto,
} from "@edem2000/amis.contracts/api/companies/responses";
import {
  mapCreateOrganizationDtoToEntity,
  mapOrganizationDtoToEntity,
} from "entities/organization/mappers";
import type { Company, CompanyList } from "entities/organization/types";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  toPaginated,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const listTag = [{ type: ApiTags.Company, id: LIST_TAG_ID }];

type SearchCompaniesParams = {
  query: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
};

export const organizationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompanies: build.query<CompanyList, GetCompaniesDto>({
      query: (params) => request(endpointAccessMap.companiesList, { params }),
      transformResponse: toPaginated(mapOrganizationDtoToEntity),
      providesTags: listTag,
    }),

    searchCompanies: build.query<CompanyList, SearchCompaniesParams>({
      query: ({ query, page = 1, limit = 10, sortOrder = "asc" }) =>
        request(endpointAccessMap.companiesSearch, {
          params: { query, page, limit, sortOrder },
        }),
      transformResponse: toPaginated(mapOrganizationDtoToEntity),
      /** Поиск показывает те же записи, что список: мутация устаревает и его. */
      providesTags: listTag,
    }),

    getCompanyById: build.query<Company, GetCompanyDto>({
      query: ({ id }) =>
        request(endpointAccessMap.companiesRead, { pathParams: { id } }),
      transformResponse: (response: SuccessOf<GetCompanyResponseDto>) =>
        mapOrganizationDtoToEntity(response.company),
      providesTags: (_result, _error, { id }) => [
        { type: ApiTags.Company, id },
      ],
    }),

    /** Компания по ИНН из государственного реестра: своей записи может не быть. */
    getCompanyByTin: build.query<Company, string>({
      query: (tin) =>
        request(endpointAccessMap.companiesByTin, { pathParams: { tin } }),
      transformResponse: (response: SuccessOf<GetCompanyByTinResponseDto>) =>
        mapOrganizationDtoToEntity(response.company),
    }),

    createCompany: build.mutation<Company, ActivateCompanyDto>({
      query: (data) => request(endpointAccessMap.companiesCreate, { data }),
      transformResponse: (response: SuccessOf<ActivateCompanyResponseDto>) =>
        mapCreateOrganizationDtoToEntity(response.company),
      invalidatesTags: listTag,
    }),

    updateCompany: build.mutation<Company, { id: string; data: UpdateCompanyDto }>({
      query: ({ id, data }) =>
        request(endpointAccessMap.companiesUpdate, { pathParams: { id }, data }),
      transformResponse: (response: SuccessOf<UpdateCompanyResponseDto>) =>
        mapOrganizationDtoToEntity(response.company),
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.Company, id },
        ...listTag,
      ],
    }),

    deleteCompany: build.mutation<void, DeleteCompanyDto>({
      query: ({ id }) =>
        request(endpointAccessMap.companiesDelete, { pathParams: { id } }),
      transformResponse: (): void => undefined,
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.Company, id },
        ...listTag,
      ],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useSearchCompaniesQuery,
  useGetCompanyByIdQuery,
  useLazyGetCompanyByIdQuery,
  useGetCompanyByTinQuery,
  useLazyGetCompanyByTinQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = organizationsApi;
