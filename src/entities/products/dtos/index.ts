import type { CreateProductDto, UpdateProductDto } from '@edem2000/amis.contracts/api/products/requests';


/**
 * Фактическая форма запроса.
 *
 * icps, productType и companyId сервер отбрасывает (whitelist: true).
 * Обязательный productGroup форма не заполняет.
 */
export type CreateProductRequestDto = Omit<CreateProductDto, 'productGroup'> & {
  icps: string;
  productType: string;
  companyId: string;
};

/** Фактическая форма запроса: icps и companyId сервер отбрасывает. */
export type UpdateProductRequestDto = UpdateProductDto & {
  icps: string;
  companyId: string;
};
