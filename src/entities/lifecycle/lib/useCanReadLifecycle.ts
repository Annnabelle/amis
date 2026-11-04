import { useCan } from "entities/access/lib";
import {
  DynamicEndpointScopes,
  endpointAccessMap,
} from "shared/config/endpointAccessMap";
import { CompanyScopeOptions } from "shared/lib/requestScope";
import { getLifecycleTargetConfig, type LifecycleTargetType } from "./targets";

/**
 * У сущности без компании (заявка с сайта) журнал читается только без
 * заголовка — значит нужны системные права. У остальных достаточно прав
 * компании либо системных.
 */
export const useCanReadLifecycle = (target: LifecycleTargetType): boolean => {
  const requiresSystemAccess =
    getLifecycleTargetConfig(target).companyScope === CompanyScopeOptions.None;

  return useCan(
    endpointAccessMap.lifecycleEvents,
    requiresSystemAccess
      ? DynamicEndpointScopes.System
      : DynamicEndpointScopes.Company
  );
};
