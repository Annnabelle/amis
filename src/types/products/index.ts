import type { HexString, MeasurementDto, WeightDto } from "../../dtos";

export type ProductResponse = {
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

export type CreateProduct = { 
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

export type ProductState = {
    product: ProductResponse | null;
    productById: ProductResponse | null;
    updateProduct: ProductResponse | null;
    products: ProductResponse[];
    isLoading: boolean;
    error: string | null;
    status: string | null;
    total: number,
    page: number,
    limit: number,
}

export type UpdateProduct = { 
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