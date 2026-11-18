import type { CreateVehicleDto } from '@edem2000/amis.contracts/api/vehicle/requests';

/**
 * Фактическая форма запроса: stateRegistrationModel обязателен в контракте,
 * но форма допускает его отсутствие.
 */
export type CreateVehicleRequestDto = Omit<
  CreateVehicleDto,
  'stateRegistrationModel'
> & {
  stateRegistrationModel?: string;
};
