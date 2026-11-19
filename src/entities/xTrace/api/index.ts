import type {
  CreateCompanyFakturaUzIntegrationResponseDto,
  CreateCompanyXTraceIntegrationResponseDto,
  GetCompanyFakturaUzIntegrationResponseDto,
  GetCompanyXTraceIntegrationResponseDto,
  UpdateCompanyXTraceIntegrationResponseDto,
} from "@edem2000/amis.contracts/api/common/responses";
import type { ValidateCompanyXTraceTokenResponseDto } from "@edem2000/amis.contracts/api/companies/responses";
import {
  mapCompanyFakturaUzIntegrationDtoToEntity,
  mapCompanyXTraceIntegrationDtoToEntity,
  mapValidateCompanyXTraceTokenResponse,
} from "entities/xTrace/mappers";
import type {
  CompanyFakturaUzIntegration,
  CompanyXTraceIntegration,
  CreateCompanyFakturaUzIntegration,
  CreateCompanyXTraceIntegration,
  UpdateCompanyXTraceIntegration,
  ValidateCompanyXTraceIntegrationToken,
  ValidateCompanyXTraceToken,
  XTraceIntegrationTokenValidation,
  XTraceTokenValidation,
} from "entities/xTrace/types";
import { ApiTags, baseApi, request, type SuccessOf } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const xTraceTag = [{ type: ApiTags.CompanyIntegration, id: "X_TRACE" }];
const fakturaUzTag = [{ type: ApiTags.CompanyIntegration, id: "FAKTURA_UZ" }];

export const xTraceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompanyXTraceIntegration: build.query<
      CompanyXTraceIntegration,
      { companyId: string }
    >({
      query: ({ companyId }) =>
        request(endpointAccessMap.integrationsXTraceRead, {
          headers: { "x-company-id": companyId },
        }),
      transformResponse: (
        response: SuccessOf<GetCompanyXTraceIntegrationResponseDto>
      ) => mapCompanyXTraceIntegrationDtoToEntity(response.integration),
      providesTags: xTraceTag,
    }),

    getCompanyFakturaUzIntegration: build.query<
      CompanyFakturaUzIntegration,
      { companyId: string }
    >({
      query: ({ companyId }) =>
        request(endpointAccessMap.integrationsFakturaUzRead, {
          headers: { "x-company-id": companyId },
        }),
      transformResponse: (
        response: SuccessOf<GetCompanyFakturaUzIntegrationResponseDto>
      ) => mapCompanyFakturaUzIntegrationDtoToEntity(response.integration),
      providesTags: fakturaUzTag,
    }),

    /** Проверка токена до активации компании: компании ещё нет, идёт глобально. */
    validateCompanyXTraceToken: build.query<
      XTraceTokenValidation,
      ValidateCompanyXTraceToken
    >({
      query: (params) =>
        request(endpointAccessMap.companiesValidateXTrace, { params }),
      transformResponse: (
        response: SuccessOf<ValidateCompanyXTraceTokenResponseDto>
      ) => mapValidateCompanyXTraceTokenResponse(response.data),
    }),

    validateCompanyXTraceIntegrationToken: build.query<
      XTraceIntegrationTokenValidation,
      ValidateCompanyXTraceIntegrationToken
    >({
      query: ({ companyId, token }) =>
        request(endpointAccessMap.integrationsXTraceValidate, {
          params: { token },
          headers: { "x-company-id": String(companyId) },
        }),
      transformResponse: (
        response: SuccessOf<ValidateCompanyXTraceTokenResponseDto>
      ) => mapValidateCompanyXTraceTokenResponse(response.data),
    }),

    createCompanyXTraceIntegration: build.mutation<
      CompanyXTraceIntegration,
      CreateCompanyXTraceIntegration
    >({
      query: ({ companyId, token, businessPlaceId }) =>
        request(endpointAccessMap.integrationsXTraceCreate, {
          data: { token, businessPlaceId },
          headers: { "x-company-id": String(companyId) },
        }),
      transformResponse: (
        response: SuccessOf<CreateCompanyXTraceIntegrationResponseDto>
      ) => mapCompanyXTraceIntegrationDtoToEntity(response.integration),
      invalidatesTags: xTraceTag,
    }),

    updateCompanyXTraceIntegration: build.mutation<
      CompanyXTraceIntegration,
      UpdateCompanyXTraceIntegration
    >({
      query: ({ companyId, token, businessPlaceId }) =>
        request(endpointAccessMap.integrationsXTraceUpdate, {
          data: { token, businessPlaceId },
          headers: { "x-company-id": String(companyId) },
        }),
      transformResponse: (
        response: SuccessOf<UpdateCompanyXTraceIntegrationResponseDto>
      ) => mapCompanyXTraceIntegrationDtoToEntity(response.integration),
      invalidatesTags: xTraceTag,
    }),

    createCompanyFakturaUzIntegration: build.mutation<
      CompanyFakturaUzIntegration,
      CreateCompanyFakturaUzIntegration
    >({
      query: ({ companyId, ...data }) =>
        request(endpointAccessMap.integrationsFakturaUzCreate, {
          data,
          headers: { "x-company-id": String(companyId) },
        }),
      transformResponse: (
        response: SuccessOf<CreateCompanyFakturaUzIntegrationResponseDto>
      ) => mapCompanyFakturaUzIntegrationDtoToEntity(response.integration),
      invalidatesTags: fakturaUzTag,
    }),
  }),
});

export const {
  useGetCompanyXTraceIntegrationQuery,
  useGetCompanyFakturaUzIntegrationQuery,
  useLazyValidateCompanyXTraceTokenQuery,
  useLazyValidateCompanyXTraceIntegrationTokenQuery,
  useCreateCompanyXTraceIntegrationMutation,
  useUpdateCompanyXTraceIntegrationMutation,
  useCreateCompanyFakturaUzIntegrationMutation,
} = xTraceApi;
