import { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { config } from "shared/config/runtime";

type LocationValue = {
  latitude?: number;
  longitude?: number;
};

export type YandexResolvedAddress = {
  address?: string;
  regionCandidates: string[];
  districtCandidates: string[];
};

type YandexAddressMapProps = {
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

type YMapsApi = {
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

type YMapInstance = {
  geoObjects: {
    add: (object: YPlacemarkInstance) => void;
  };
  events: {
    add: (eventName: string, callback: (event: YMapEvent) => void) => void;
  };
  setCenter: (coordinates: number[], zoom?: number) => void;
  destroy: () => void;
};

type YMapEvent = {
  get: (key: string) => number[] | undefined;
};

type YPlacemarkInstance = {
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

const DEFAULT_CENTER = [41.311081, 69.240562];
const DEFAULT_ZOOM = 13;
const SELECTED_POINT_ZOOM = 17;
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

const geocodeByAddress = async (address: string) => {
  const url = new URL("https://geocode-maps.yandex.ru/1.x/");
  url.searchParams.set("apikey", config.yandexGeocoderApiKey as string);
  url.searchParams.set("format", "json");
  url.searchParams.set("lang", "ru_RU");
  url.searchParams.set("geocode", address);

  console.groupCollapsed("[SalesOrdersAddressMap] geocode by address");
  console.info("request", { address, geocode: url.searchParams.get("geocode") });

  try {
    const response = await fetch(url.toString());
    const data = await response.json() as GeocoderResponse;
    const geoObject = data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
    const pos = geoObject?.Point?.pos;

    console.info("raw result", {
      pos,
      text: geoObject?.metaDataProperty?.GeocoderMetaData?.text,
      formatted: geoObject?.metaDataProperty?.GeocoderMetaData?.Address?.formatted,
      components: geoObject?.metaDataProperty?.GeocoderMetaData?.Address?.Components,
    });

    if (!pos) {
      console.warn("result", "coordinates not found");
      return undefined;
    }

    const [longitude, latitude] = pos.split(" ").map(Number);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      console.warn("result", "coordinates are invalid", { latitude, longitude });
      return undefined;
    }

    console.info("result", { latitude, longitude });
    return { latitude, longitude };
  } catch (error) {
    console.error("failed", error);
    return undefined;
  } finally {
    console.groupEnd();
  }
};

const geocodeByLocation = async (location: { latitude: number; longitude: number }) => {
  const url = new URL("https://geocode-maps.yandex.ru/1.x/");
  url.searchParams.set("apikey", config.yandexGeocoderApiKey as string);
  url.searchParams.set("format", "json");
  url.searchParams.set("lang", "ru_RU");
  url.searchParams.set("geocode", `${location.longitude},${location.latitude}`);

  console.groupCollapsed("[SalesOrdersAddressMap] reverse geocode by location");
  console.info("request", location);

  try {
    const response = await fetch(url.toString());
    const data = await response.json() as GeocoderResponse;
    const featureMembers = data.response?.GeoObjectCollection?.featureMember ?? [];
    const geoObject = featureMembers[0]?.GeoObject;
    const parsedAddress = parseGeocoderAddress(featureMembers);

    console.info("raw result", {
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
    console.info("parsed result", parsedAddress);

    if (!parsedAddress) {
      console.warn("result", "address not found");
    }

    return parsedAddress;
  } catch (error) {
    console.error("failed", error);
    return undefined;
  } finally {
    console.groupEnd();
  }
};

const loadYandexMaps = () =>
  new Promise<YMapsApi>((resolve, reject) => {
    const apiUrl = buildYandexMapsApiUrl();
    const expectedScriptSrc = apiUrl.toString();

    const resolveWhenReady = (ymaps: YMapsApi) => {
      console.info("[SalesOrdersAddressMap] request route modules", ["route"]);
      ymaps.ready({
        require: ["route"],
        successCallback: () => {
          console.info("[SalesOrdersAddressMap] route modules ready", {
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
        console.warn("[SalesOrdersAddressMap] reload Yandex Maps API script with expected params", {
          existingScriptSrc,
          expectedScriptSrc,
          hasApiKey: Boolean(config.yandexMapsJsApiKey),
        });
        existingScript.remove();
        window.ymaps = undefined;
      } else {
        console.info("[SalesOrdersAddressMap] reuse Yandex Maps API script", {
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
    console.info("[SalesOrdersAddressMap] load Yandex Maps API script", {
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

const isValidLocation = (location?: LocationValue): location is { latitude: number; longitude: number } =>
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

  console.groupCollapsed("[SalesOrdersAddressMap] calculate delivery distance");
  console.info("points", { from, to });

  try {
    const ymaps = await loadYandexMaps();

    if (typeof ymaps.route !== "function") {
      const fallbackResult = calculateYandexGeoDistanceKm(ymaps, from, to);
      console.warn("ymaps.route is not available, using geo distance", fallbackResult);
      return fallbackResult;
    }

    try {
      console.info("route calculation started");
      const route = await ymaps.route(
        [
          { type: "wayPoint", point: [from.latitude, from.longitude] },
          { type: "wayPoint", point: [to.latitude, to.longitude] },
        ],
        { routingMode: "auto" }
      );

      const distance = metersToKm(route.getLength());
      const result = distance === undefined ? undefined : { distance, source: "route" as const };
      console.info("route calculation success", result);
      return result;
    } catch (error) {
      const fallbackResult = calculateYandexGeoDistanceKm(ymaps, from, to);
      console.warn("route distance unavailable, using geo distance");
      console.warn("route error serialized", stringifyYandexError(error));
      console.warn("geo fallback result", fallbackResult);
      return fallbackResult;
    }
  } catch (error) {
    console.error("[SalesOrdersAddressMap] failed to calculate route distance", stringifyYandexError(error));
    return undefined;
  } finally {
    console.groupEnd();
  }
};

const YandexAddressMap = ({
  address,
  forcedGeocodeAddress,
  geocodeAddress,
  geocodeRequestKey,
  location,
  onAddressChange,
  onAddressSelect,
  onForcedGeocodeComplete,
  onLocationChange,
}: YandexAddressMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ymapsRef = useRef<YMapsApi | null>(null);
  const mapRef = useRef<YMapInstance | null>(null);
  const placemarkRef = useRef<YPlacemarkInstance | null>(null);
  const skipNextAddressGeocodeRef = useRef(false);
  const onAddressChangeRef = useRef(onAddressChange);
  const onAddressSelectRef = useRef(onAddressSelect);
  const onLocationChangeRef = useRef(onLocationChange);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    onAddressChangeRef.current = onAddressChange;
    onAddressSelectRef.current = onAddressSelect;
    onLocationChangeRef.current = onLocationChange;
  }, [onAddressChange, onAddressSelect, onLocationChange]);

  const setPoint = (nextLocation: { latitude: number; longitude: number }, zoom?: number) => {
    const coordinates = [nextLocation.latitude, nextLocation.longitude];
    placemarkRef.current?.geometry.setCoordinates(coordinates);
    mapRef.current?.setCenter(coordinates, zoom);
    onLocationChangeRef.current(nextLocation);
  };

  const updateAddressByLocation = (nextLocation: { latitude: number; longitude: number }) => {
    geocodeByLocation(nextLocation).then((nextAddress) => {
      if (!nextAddress) {
        console.warn("[SalesOrdersAddressMap] skip form update: reverse geocode returned no address");
        return;
      }

      skipNextAddressGeocodeRef.current = true;
      if (nextAddress.address) {
        console.info("[SalesOrdersAddressMap] set address field", nextAddress.address);
        onAddressChangeRef.current(nextAddress.address);
      }
      console.info("[SalesOrdersAddressMap] pass address to reference resolver", nextAddress);
      onAddressSelectRef.current?.(nextAddress);
    });
  };

  useEffect(() => {
    let isMounted = true;

    loadYandexMaps()
      .then((ymaps) => {
        if (!isMounted || !containerRef.current) return;

        ymapsRef.current = ymaps;
        const center = isValidLocation(location)
          ? [location.latitude, location.longitude]
          : DEFAULT_CENTER;

        const map = new ymaps.Map(containerRef.current, {
          center,
          zoom: isValidLocation(location) ? SELECTED_POINT_ZOOM : DEFAULT_ZOOM,
          controls: ["zoomControl", "geolocationControl"],
        });
        const placemark = new ymaps.Placemark(
          center,
          {},
          {
            draggable: true,
            preset: "islands#redDotIcon",
          }
        );

        placemark.events.add("dragend", () => {
          const coordinates = placemark.geometry.getCoordinates();
          const nextLocation = {
            latitude: Number(coordinates[0]),
            longitude: Number(coordinates[1]),
          };

          onLocationChangeRef.current(nextLocation);
          updateAddressByLocation(nextLocation);
        });

        map.events.add("click", (event) => {
          const coordinates = event.get("coords");
          if (!coordinates || coordinates.length < 2) return;

          const nextLocation = {
            latitude: Number(coordinates[0]),
            longitude: Number(coordinates[1]),
          };

          if (!Number.isFinite(nextLocation.latitude) || !Number.isFinite(nextLocation.longitude)) return;

          setPoint(nextLocation);
          updateAddressByLocation(nextLocation);
        });

        map.geoObjects.add(placemark);
        mapRef.current = map;
        placemarkRef.current = placemark;
        setIsMapReady(true);
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      mapRef.current?.destroy();
      mapRef.current = null;
      placemarkRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!isValidLocation(location) || !placemarkRef.current || !mapRef.current) return;
    const current = placemarkRef.current.geometry.getCoordinates();
    if (current[0] === location.latitude && current[1] === location.longitude) return;
    setPoint(location, SELECTED_POINT_ZOOM);
  }, [location?.latitude, location?.longitude]);

  useEffect(() => {
    const searchAddress = forcedGeocodeAddress?.trim() || geocodeAddress?.trim() || address?.trim();
    const isForcedGeocode = Boolean(forcedGeocodeAddress?.trim());

    if (!searchAddress || !isMapReady || !ymapsRef.current || skipNextAddressGeocodeRef.current) {
      skipNextAddressGeocodeRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      geocodeByAddress(searchAddress).then((nextLocation) => {
        if (nextLocation) setPoint(nextLocation, SELECTED_POINT_ZOOM);
        if (isForcedGeocode) onForcedGeocodeComplete?.();
      });
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [address, geocodeAddress, geocodeRequestKey, isMapReady]);

  return (
    <div style={{ position: "relative", width: "100%", minHeight: 300 }}>
      {isLoading && (
        <div style={{ alignItems: "center", display: "flex", inset: 0, justifyContent: "center", position: "absolute" }}>
          <Spin />
        </div>
      )}
      <div
        ref={containerRef}
        style={{ borderRadius: 8, height: 300, overflow: "hidden", width: "100%" }}
      />
    </div>
  );
};

export default YandexAddressMap;
