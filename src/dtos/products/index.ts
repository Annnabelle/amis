import type {
  AvailablePackageType,
  ErrorDto, HexString, MeasurementDto, PaginatedDto, PaginatedResponseDto, ProductSortField, ProductStatus, WeightDto
} from "..";

export type ProductResponseDto = {
  id: string;
  name: string;
  shortName: string;
  description?: string | null;

  gtin: {
    unit: string,
    group?: string,
    box_lv_1?: string,
    box_lv_2?: string,
  };
  icps: string;
  productType: string;
  packageTypes: AvailablePackageType[];

  aggregationQuantity: number;
  expiration?: number | null;
  manufacturerCountry: string

  measurement: { unit: string; amount: number };
  weight: { net: number; gross: number };

  price: number;
  companyId: string;
};

export type GtinDto = {
  unit: string;
  group?: string;
  box_lv_1?: string;
  box_lv_2?: string;
}

export type CreateProductDto  = {
  name: string;
  shortName: string;
  description?: string;
  gtin: GtinDto;
  icps: string;
  productType: string;
  manufacturerCountry: string;
  aggregationQuantity: number;
  expiration: number;
  measurement: MeasurementDto;
  weight: WeightDto;
  price: number;
  companyId: HexString;
}

export type CreateProductResponseDto = {
  success: boolean,
  product: ProductResponseDto,
} | ErrorDto;

export type DeleteProductDto = {
  id: string;
}

export type DeleteProductResponseDto = {
  success: boolean,
} | ErrorDto;

export type GetProductDto = {
  id: string;
}

export type GetProductResponseDto = {
  success: boolean;
  product: ProductResponseDto;
} | ErrorDto;

export type GetProductsDto = PaginatedDto &{
  status?: ProductStatus;
  sortBy?: ProductSortField;
  companyId: HexString;
}

export type GetProductsResponseDto = {
  success: boolean;
} & PaginatedResponseDto<ProductResponseDto> | ErrorDto;

export type SearchProductsDto = PaginatedDto & {
  query: string;
  companyId?: string;
}

export type UpdateProductDto = {
  name?: string;
  shortName?: string;
  description?: string;
  gtin?: GtinDto;
  icps?: string;
  productType?: string;
  aggregationQuantity?: number;
  manufacturerCountry?: string;
  expiration?: number;
  measurement?: MeasurementDto;
  weight?: WeightDto;
  price?: number;
  companyId?: HexString;
}

export type UpdateProductResponseDto = {
  success: boolean;
  product: ProductResponseDto;
} | ErrorDto;
