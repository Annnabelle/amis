import type { ErrorDto, HexString, MeasurementDto, PaginatedDto, PaginatedResponseDto, ProductSortField, ProductStatus, WeightDto } from "..";

export type ProductResponseDto = {
  id: string;
  name: string;
  shortName: string;
  description?: string | null;

  gtin: string;
  barcode: string;
  icps: string;
  productType: string;

  aggregationQuantity: number;
  expiration?: number | null;

  measurement: { unit: string; amount: number };
  weight: { net: number; gross: number };

  price: number;
  companyId: string;
};

export type CreateProductDto  = { 
  name: string;
  shortName: string;
  description?: string;
  gtin: string;
  barcode: string;
  icps: string;
  productType: string;
  aggregationQuantity: number;
  expiration?: number;
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
  gtin?: string;    
  barcode?: string; 
  icps?: string;    
  productType?: string; 
  aggregationQuantity?: number; 
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
