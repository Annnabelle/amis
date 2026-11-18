import type { CreateDeliveryRouteDto } from '@edem2000/amis.contracts/api/delivery-routes/requests';


/**
 * Фактическая форма запроса: vehicleId, name, plateNumber, driverId и
 * driverName обязательны в контракте, но форма допускает их отсутствие.
 */
export type CreateDeliveryRouteRequestDto = Omit<
  CreateDeliveryRouteDto,
  'vehicle' | 'crew'
> & {
  vehicle: Partial<CreateDeliveryRouteDto['vehicle']>;
  crew?: Partial<NonNullable<CreateDeliveryRouteDto['crew']>>;
  /** Компания приходит заголовком x-company-id. */
  companyId?: string;
};
