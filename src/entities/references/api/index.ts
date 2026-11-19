import type {
  GetDistrictReferencesResponseDto,
  GetReferenceByTypeResponseDto,
  GetRegionReferencesResponseDto,
} from "@edem2000/amis.contracts/api/reference-book/responses";
import {
  mapAddressReferenceDtoToReference,
  mapReferenceDtoToReference,
} from "entities/references/mappers";
import type { Reference, ReferenceBookType } from "entities/references/types";
import { baseApi, request, type SuccessOf } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

/**
 * Справочники меняются редко, поэтому записи живут в кеше дольше обычного:
 * страницы запрашивают их на каждом монтировании.
 */
const REFERENCES_CACHE_SECONDS = 3600;

export const referencesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReferencesByType: build.query<Reference[], ReferenceBookType>({
      query: (type) =>
        request(endpointAccessMap.referencesRead, { pathParams: { type } }),
      transformResponse: (response: SuccessOf<GetReferenceByTypeResponseDto>) =>
        response.references.map(mapReferenceDtoToReference),
      keepUnusedDataFor: REFERENCES_CACHE_SECONDS,
    }),

    getRegions: build.query<Reference[], void>({
      query: () =>
        request(endpointAccessMap.referencesRead, {
          pathParams: { type: "regions" },
        }),
      transformResponse: (response: SuccessOf<GetRegionReferencesResponseDto>) =>
        response.regions.map(mapAddressReferenceDtoToReference),
      keepUnusedDataFor: REFERENCES_CACHE_SECONDS,
    }),

    getDistrictsByRegion: build.query<Reference[], string>({
      query: (regionId) =>
        request(endpointAccessMap.referencesRead, {
          pathParams: { type: "districts" },
          params: { regionId },
        }),
      transformResponse: (
        response: SuccessOf<GetDistrictReferencesResponseDto>
      ) => response.districts.map(mapAddressReferenceDtoToReference),
      keepUnusedDataFor: REFERENCES_CACHE_SECONDS,
    }),
  }),
});

export const {
  useGetReferencesByTypeQuery,
  useGetRegionsQuery,
  useGetDistrictsByRegionQuery,
  useLazyGetDistrictsByRegionQuery,
} = referencesApi;
