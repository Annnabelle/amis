/**
 * Работа с Яндекс.Картами для адресов заказа: загрузка API, геокодирование
 * и расчёт расстояния. Отдельным модулем, потому что рядом с компонентом
 * не-компонентные экспорты ломают fast refresh.
 */
import { config } from "shared/config/runtime";
import { debugLog } from "shared/lib/debugLog";

export type LocationValue = {
  latitude?: number;
  longitude?: number;
};

export type YandexResolvedAddress = {
  address?: string;
  regionCandidates: string[];
  districtCandidates: string[];
};

export type YandexAddressMapProps = {
  address?: string;
  forcedGeocodeAddress?: string;
  geocodeAddress?: string;
  geocodeRequestKey?: number;
  location?: LocationValue;
  onAddressChange: (address: string) => void;
  onAddressSelect?: (address: YandexResolvedAddress) => void;
  onForcedGeocodeComplete?: () => void;
  onLocationChange: (location: { latitude: number; longitude: number }) => void;
};

export type YMapsApi = {
  ready: (
    callback:
      | (() => void)
      | {
          require?: string[];
          successCallback?: () => void;
          errorCallback?: (error: unknown) => void;
        }
  ) => void;
  coordSystem?: {
    geo?: {
      getDistance: (from: number[], to: number[]) => number;
    };
  };
  route: (
    points: (number[] | { type: "wayPoint" | "viaPoint"; point: number[] | string })[],
    options?: { routingMode?: "auto" | "masstransit" | "pedestrian" | "bicycle" }
  ) => Promise<YRouteInstance>;
  Map: new (
    element: HTMLElement,
    options: { center: number[]; zoom: number; controls?: string[] }
  ) => YMapInstance;
  Placemark: new (
    coordinates: number[],
    properties: Record<string, unknown>,
    options: Record<string, unknown>
  ) => YPlacemarkInstance;
};

export type YMapInstance = {
  geoObjects: {
    add: (object: YPlacemarkInstance) => void;
  };
  events: {
    add: (eventName: string, callback: (event: YMapEvent) => void) => void;
  };
  setCenter: (coordinates: number[], zoom?: number) => void;
  destroy: () => void;
};

export type YMapEvent = {
  get: (key: string) => number[] | undefined;
};

export type YPlacemarkInstance = {
  geometry: {
    setCoordinates: (coordinates: number[]) => void;
    getCoordinates: () => number[];
  };
  events: {
    add: (eventName: string, callback: () => void) => void;
  };
};

type YRouteInstance = {
  getLength: () => number;
};

type GeocoderResponse = {
  response?: {
    GeoObjectCollection?: {
      featureMember?: {
        GeoObject?: {
          name?: string;
          description?: string;
          Point?: {
            pos?: string;
          };
          metaDataProperty?: {
            GeocoderMetaData?: {
              kind?: string;
              text?: string;
              Address?: {
                formatted?: string;
                Components?: {
                  kind?: string;
                  name?: string;
                }[];
              };
              AddressDetails?: {
                Country?: {
                  CountryName?: string;
                  AdministrativeArea?: {
                    AdministrativeAreaName?: string;
                    SubAdministrativeArea?: YandexSubAdministrativeArea;
                    Locality?: {
                      LocalityName?: string;
                      DependentLocality?: YandexDependentLocality;
                    };
                  };
                };
              };
            };
          };
        };
      }[];
    };
  };
};

type YandexDependentLocality = {
  DependentLocalityName?: string;
  DependentLocality?: YandexDependentLocality;
};

type YandexSubAdministrativeArea = {
  SubAdministrativeAreaName?: string;
  Locality?: {
    LocalityName?: string;
    DependentLocality?: YandexDependentLocality;
  };
};

declare global {
  interface Window {
    ymaps?: YMapsApi;
  }
}

export const DEFAULT_CENTER = [41.311081, 69.240562];
export const DEFAULT_ZOOM = 13;
export const SELECTED_POINT_ZOOM = 17;
const YANDEX_MAPS_SCRIPT_ID = "yandex-maps-api";

const buildYandexMapsApiUrl = () => {
  const url = new URL("https://api-maps.yandex.ru/2.1/");

  url.searchParams.set("lang", "ru_RU");
  url.searchParams.set("load", "package.full,route");
  if (config.yandexMapsJsApiKey) {
    url.searchParams.set("apikey", config.yandexMapsJsApiKey);
  }

  return url;
};

type GeoObject = NonNullable<
  NonNullable<
    NonNullable<GeocoderResponse["response"]>["GeoObjectCollection"]
  >["featureMember"]
>[number]["GeoObject"];

type FeatureMember = NonNullable<
  NonNullable<
    NonNullable<GeocoderResponse["response"]>["GeoObjectCollection"]
  >["featureMember"]
>[number];

const REGION_COMPONENT_KINDS = new Set(["province", "locality"]);
const DISTRICT_COMPONENT_KINDS = new Set(["district", "area"]);
const ADDRESS_COMPONENT_KINDS = new Set([
  "street",
  "house",
  "entrance",
  "level",
  "apartment",
  "premise",
  "other",
]);

const unique = (items: (string | undefined)[]) => {
  const result: string[] = [];

  items.forEach((item) => {
    const value = item?.trim();
    if (value && !result.includes(value)) result.push(value);
  });

  return result;
};

const getGeoObjectComponents = (geoObject?: GeoObject) =>
  geoObject?.metaDataProperty?.GeocoderMetaData?.Address?.Components ?? [];

const getAddressDetailsDistricts = (geoObject?: GeoObject) => {
  const administrativeArea = geoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails
    ?.Country?.AdministrativeArea;
  const subAdministrativeArea = administrativeArea?.SubAdministrativeArea;
  const locality = administrativeArea?.Locality ?? subAdministrativeArea?.Locality;
  const firstDistrict = locality?.DependentLocality;
  const secondDistrict = firstDistrict?.DependentLocality;

  return unique([
    subAdministrativeArea?.SubAdministrativeAreaName,
    firstDistrict?.DependentLocalityName,
    secondDistrict?.DependentLocalityName,
  ]);
};

const getAddressDetailsRegions = (geoObject?: GeoObject) => {
  const country = geoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country;
  const administrativeArea = country?.AdministrativeArea;
  const subAdministrativeArea = administrativeArea?.SubAdministrativeArea;
  const locality = administrativeArea?.Locality ?? subAdministrativeArea?.Locality;

  return unique([
    administrativeArea?.AdministrativeAreaName,
    locality?.LocalityName,
  ]);
};

const getGeoObjectAddressTextParts = (geoObject?: GeoObject) => {
  const metadata = geoObject?.metaDataProperty?.GeocoderMetaData;

  return unique([
    geoObject?.name,
    geoObject?.description,
    metadata?.text,
    metadata?.Address?.formatted,
  ]);
};

const parseGeocoderAddress = (featureMembers: FeatureMember[] = []): YandexResolvedAddress | undefined => {
  const geoObjects = featureMembers
    .map((featureMember) => featureMember.GeoObject)
    .filter(Boolean);
  const geoObject = geoObjects[0];
  const metadata = geoObject?.metaDataProperty?.GeocoderMetaData;
  const components = getGeoObjectComponents(geoObject);
  const allComponents = geoObjects.flatMap(getGeoObjectComponents);

  if (geoObjects.length === 0 || components.length === 0) {
    const fallbackAddress = metadata?.Address?.formatted ?? metadata?.text;
    const fallbackTextParts = geoObjects.flatMap(getGeoObjectAddressTextParts);

    return fallbackAddress
      ? {
          address: fallbackAddress,
          regionCandidates: unique([
            ...geoObjects.flatMap(getAddressDetailsRegions),
            ...fallbackTextParts,
          ]),
          districtCandidates: unique([
            ...geoObjects.flatMap(getAddressDetailsDistricts),
            ...fallbackTextParts,
          ]),
        }
      : undefined;
  }

  const address = unique(
    components
      .filter((component) => component.kind && ADDRESS_COMPONENT_KINDS.has(component.kind))
      .map((component) => component.name)
  ).join(", ");

  return {
    address,
    regionCandidates: unique(
      [
        ...allComponents
          .filter((component) => component.kind && REGION_COMPONENT_KINDS.has(component.kind))
          .map((component) => component.name),
        ...geoObjects.flatMap(getAddressDetailsRegions),
        ...geoObjects.flatMap(getGeoObjectAddressTextParts),
      ]
    ),
    districtCandidates: unique(
      [
        ...allComponents
        .filter((component) => component.kind && DISTRICT_COMPONENT_KINDS.has(component.kind))
          .map((component) => component.name),
        ...geoObjects.flatMap(getAddressDetailsDistricts),
        ...geoObjects.flatMap(getGeoObjectAddressTextParts),
      ]
    ),
  };
};

export const geocodeByAddress = async (address: string) => {
  const url = new URL("https://geocode-maps.yandex.ru/1.x/");
  url.searchParams.set("apikey", config.yandexGeocoderApiKey as string);
  url.searchParams.set("format", "json");
  url.searchParams.set("lang", "ru_RU");
  url.searchParams.set("geocode", address);

  debugLog.group("[SalesOrdersAddressMap] geocode by address");
  debugLog.info("request", { address, geocode: url.searchParams.get("geocode") });

  try {
    const response = await fetch(url.toString());
    const data = await response.json() as GeocoderResponse;
    const geoObject = data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
    const pos = geoObject?.Point?.pos;

    debugLog.info("raw result", {
      pos,
      text: geoObject?.metaDataProperty?.GeocoderMetaData?.text,
      formatted: geoObject?.metaDataProperty?.GeocoderMetaData?.Address?.formatted,
      components: geoObject?.metaDataProperty?.GeocoderMetaData?.Address?.Components,
    });

    if (!pos) {
      debugLog.warn("result", "coordinates not found");
      return undefined;
    }

    const [longitude, latitude] = pos.split(" ").map(Number);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      debugLog.warn("result", "coordinates are invalid", { latitude, longitude });
      return undefined;
    }

    debugLog.info("result", { latitude, longitude });
    return { latitude, longitude };
  } catch (error) {
    console.error("failed", error);
    return undefined;
  } finally {
    debugLog.groupEnd();
  }
};

export const geocodeByLocation = async (location: { latitude: number; longitude: number }) => {
  const url = new URL("https://geocode-maps.yandex.ru/1.x/");
  url.searchParams.set("apikey", config.yandexGeocoderApiKey as string);
  url.searchParams.set("format", "json");
  url.searchParams.set("lang", "ru_RU");
  url.searchParams.set("geocode", `${location.longitude},${location.latitude}`);

  debugLog.group("[SalesOrdersAddressMap] reverse geocode by location");
  debugLog.info("request", location);

  try {
    const response = await fetch(url.toString());
    const data = await response.json() as GeocoderResponse;
    const featureMembers = data.response?.GeoObjectCollection?.featureMember ?? [];
    const geoObject = featureMembers[0]?.GeoObject;
    const parsedAddress = parseGeocoderAddress(featureMembers);

    debugLog.info("raw result", {
      text: geoObject?.metaDataProperty?.GeocoderMetaData?.text,
      formatted: geoObject?.metaDataProperty?.GeocoderMetaData?.Address?.formatted,
      components: geoObject?.metaDataProperty?.GeocoderMetaData?.Address?.Components,
      featureMembers: featureMembers.map((featureMember) => {
        const item = featureMember.GeoObject;

        return {
          name: item?.name,
          description: item?.description,
          kind: item?.metaDataProperty?.GeocoderMetaData?.kind,
          text: item?.metaDataProperty?.GeocoderMetaData?.text,
          components: item?.metaDataProperty?.GeocoderMetaData?.Address?.Components,
        };
      }),
    });
    debugLog.info("parsed result", parsedAddress);

    if (!parsedAddress) {
      debugLog.warn("result", "address not found");
    }

    return parsedAddress;
  } catch (error) {
    console.error("failed", error);
    return undefined;
  } finally {
    debugLog.groupEnd();
  }
};

export const loadYandexMaps = () =>
  new Promise<YMapsApi>((resolve, reject) => {
    const apiUrl = buildYandexMapsApiUrl();
    const expectedScriptSrc = apiUrl.toString();

    const resolveWhenReady = (ymaps: YMapsApi) => {
      debugLog.info("[SalesOrdersAddressMap] request route modules", ["route"]);
      ymaps.ready({
        require: ["route"],
        successCallback: () => {
          debugLog.info("[SalesOrdersAddressMap] route modules ready", {
            hasRouteFunction: typeof ymaps.route === "function",
          });
          resolve(ymaps);
        },
        errorCallback: (error) => {
          console.error("[SalesOrdersAddressMap] failed to load route modules", error);
          reject(error);
        },
      });
    };

    const existingScript = document.getElementById(YANDEX_MAPS_SCRIPT_ID);
    if (existingScript) {
      const existingScriptSrc = (existingScript as HTMLScriptElement).src;
      if (existingScriptSrc !== expectedScriptSrc) {
        debugLog.warn("[SalesOrdersAddressMap] reload Yandex Maps API script with expected params", {
          existingScriptSrc,
          expectedScriptSrc,
          hasApiKey: Boolean(config.yandexMapsJsApiKey),
        });
        existingScript.remove();
        window.ymaps = undefined;
      } else {
        debugLog.info("[SalesOrdersAddressMap] reuse Yandex Maps API script", {
          scriptSrc: existingScriptSrc,
          hasApiKey: Boolean(config.yandexMapsJsApiKey),
        });
      }
    }

    if (window.ymaps) {
      resolveWhenReady(window.ymaps as YMapsApi);
      return;
    }

    const currentScript = document.getElementById(YANDEX_MAPS_SCRIPT_ID);
    if (currentScript) {
      currentScript.addEventListener("load", () => {
        if (window.ymaps) resolveWhenReady(window.ymaps as YMapsApi);
      });
      currentScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = YANDEX_MAPS_SCRIPT_ID;
    script.src = expectedScriptSrc;
    script.async = true;
    debugLog.info("[SalesOrdersAddressMap] load Yandex Maps API script", {
      scriptSrc: script.src,
      hasApiKey: Boolean(config.yandexMapsJsApiKey),
      routeModules: ["route"],
    });
    script.onload = () => {
      if (window.ymaps) resolveWhenReady(window.ymaps as YMapsApi);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

export const isValidLocation = (location?: LocationValue): location is { latitude: number; longitude: number } =>
  Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude);

const metersToKm = (meters: number) =>
  Number.isFinite(meters) ? Math.round((meters / 1000) * 10) / 10 : undefined;

const serializeYandexError = (error: unknown) => {
  if (!error || typeof error !== "object") return error;

  const record = error as Record<string, unknown>;

  return {
    name: record.name,
    message: record.message,
    status: record.status,
    code: record.code,
    type: record.type,
    text: record.text,
    details: record.details,
    data: record.data,
    raw: record,
  };
};

const stringifyYandexError = (error: unknown) => {
  const serialized = serializeYandexError(error);

  try {
    return JSON.stringify(serialized, (_key, value) => {
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack,
        };
      }

      if (typeof value === "function") return undefined;

      return value;
    });
  } catch {
    return String(error);
  }
};

const calculateYandexGeoDistanceKm = (
  ymaps: YMapsApi,
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
) => {
  const distance = ymaps.coordSystem?.geo?.getDistance(
    [from.latitude, from.longitude],
    [to.latitude, to.longitude]
  );

  const distanceKm = typeof distance === "number" ? metersToKm(distance) : undefined;

  return distanceKm === undefined ? undefined : { distance: distanceKm, source: "geo" as const };
};

export const calculateYandexRouteDistanceKm = async (
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
): Promise<{ distance: number; source: "route" | "geo" } | undefined> => {
  if (!isValidLocation(from) || !isValidLocation(to)) return undefined;

  debugLog.group("[SalesOrdersAddressMap] calculate delivery distance");
  debugLog.info("points", { from, to });

  try {
    const ymaps = await loadYandexMaps();

    if (typeof ymaps.route !== "function") {
      const fallbackResult = calculateYandexGeoDistanceKm(ymaps, from, to);
      debugLog.warn("ymaps.route is not available, using geo distance", fallbackResult);
      return fallbackResult;
    }

    try {
      debugLog.info("route calculation started");
      const route = await ymaps.route(
        [
          { type: "wayPoint", point: [from.latitude, from.longitude] },
          { type: "wayPoint", point: [to.latitude, to.longitude] },
        ],
        { routingMode: "auto" }
      );

      const distance = metersToKm(route.getLength());
      const result = distance === undefined ? undefined : { distance, source: "route" as const };
      debugLog.info("route calculation success", result);
      return result;
    } catch (error) {
      const fallbackResult = calculateYandexGeoDistanceKm(ymaps, from, to);
      debugLog.warn("route distance unavailable, using geo distance");
      debugLog.warn("route error serialized", stringifyYandexError(error));
      debugLog.warn("geo fallback result", fallbackResult);
      return fallbackResult;
    }
  } catch (error) {
    console.error("[SalesOrdersAddressMap] failed to calculate route distance", stringifyYandexError(error));
    return undefined;
  } finally {
    debugLog.groupEnd();
  }
};
