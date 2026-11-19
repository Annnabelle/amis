import { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  SELECTED_POINT_ZOOM,
  geocodeByAddress,
  geocodeByLocation,
  isValidLocation,
  loadYandexMaps,
  type YMapInstance,
  type YMapsApi,
  type YPlacemarkInstance,
  type YandexAddressMapProps,
} from "./yandexMaps";

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
