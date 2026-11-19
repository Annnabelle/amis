import type { GetAuditLogsDto } from "@edem2000/amis.contracts/api/audit-logs/requests";
import { mapAuditLogResponseDtoToEntity } from "entities/auditLog/mappers";
import type { AuditLogList } from "entities/auditLog/types";
import { baseApi, request, toPaginated } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

export const auditLogsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAuditLogs: build.query<AuditLogList, GetAuditLogsDto>({
      query: (params) => request(endpointAccessMap.auditList, { params }),
      transformResponse: toPaginated(mapAuditLogResponseDtoToEntity),
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditLogsApi;
