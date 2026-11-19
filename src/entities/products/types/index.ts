import type { Paginated } from 'shared/api';
import type {PackageType, HexString, MultiLanguage} from "shared/types/dtos";

export type ProductClassification = {
    icps: string;
    name: string;
    source: string;
    resolvedAt: Date;
};

export type Product = {
    id: string;
    name: string;
    shortName: string;
    description?: string | null;

    gtin: Gtin;
    classification: ProductClassification | null;
    brand?: string | null;
    productGroup?: string;
    packageTypes: PackageType[];

    aggregationQuantity: number;
    expiration?: number | null;
    manufacturerCountry: string

    measurement?: Measurement;
    weight?: Weight;

    price?: number;
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

export type ProductPackage = {
    code: string;
    icps: string;
    type?: string;
    name: MultiLanguage;
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

export type ProductList = Paginated<Product>;

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
    measurement?: Partial<Measurement>;
    weight?: Partial<Weight>;
    price?: number;
    companyId?: HexString;
}



