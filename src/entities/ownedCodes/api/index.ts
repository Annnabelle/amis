import type { GetOwnedCodesParamDto } from "@edem2000/amis.contracts/api/codes/requests";
import type { GetOwnedCodesSummaryResponseDto } from "@edem2000/amis.contracts/api/codes/responses";
import {
  mapOwnedCodeDtoToEntity,
  mapOwnedCodesSummaryDtoToEntity,
} from "entities/ownedCodes/mappers";
import type {
  OwnedCodeList,
  OwnedCodesSummary,
} from "entities/ownedCodes/types";
import { baseApi, request, toPaginated, type SuccessOf } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

export const ownedCodesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOwnedCodes: build.query<OwnedCodeList, GetOwnedCodesParamDto>({
      query: ({ page, limit, gtin }) =>
        request(endpointAccessMap.ownedCodesList, {
          params: { page, limit, gtin: gtin || undefined },
        }),
      transformResponse: toPaginated(mapOwnedCodeDtoToEntity),
    }),

    getOwnedCodesSummary: build.query<OwnedCodesSummary, void>({
      query: () => request(endpointAccessMap.ownedCodesSummary),
      transformResponse: (
        response: SuccessOf<GetOwnedCodesSummaryResponseDto>
      ) => mapOwnedCodesSummaryDtoToEntity(response),
    }),
  }),
});

export const { useGetOwnedCodesQuery, useGetOwnedCodesSummaryQuery } =
  ownedCodesApi;
