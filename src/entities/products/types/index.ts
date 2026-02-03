import type {AvailablePackageType, HexString, MeasurementDto, WeightDto} from "shared/types/dtos";

export type ProductResponse = {
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

export type Gtin = {
    unit: string;
    group?: string;
    box_lv_1?: string;
    box_lv_2?: string;
}

export type Measurement = {
    unit: string;
    amount: number;
}

export type Weight = {
    net: number;
    gross: number;
}

export type CreateProduct = {
    name: string;
    shortName: string;
    description?: string;
    gtin: Gtin;
    icps: string;
    productType: string;
    manufacturerCountry: string;
    aggregationQuantity: number;
    expiration: number;
    measurement: Measurement;
    weight: Weight;
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
    gtin?: Gtin;
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



