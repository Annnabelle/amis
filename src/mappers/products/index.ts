import type { CreateProductDto, ProductResponseDto, UpdateProductDto } from "../../dtos/products";
import type { CreateProduct, ProductResponse, UpdateProduct } from "../../types/products";


export function mapCreateProductToCreateProductDto(form: CreateProduct ) : CreateProductDto {
    return {
        name: form.name,
        shortName: form.shortName,
        description: form.description,
        gtin: form.gtin,
        barcode: form.barcode,
        icps: form.icps,
        productType: form.productType,
        aggregationQuantity: form.aggregationQuantity,
        expiration: form.expiration,
        measurement: form.measurement,
        weight: form.weight,
        price: form.price,
        companyId: form.companyId
    }
}

export const mapProductDtoToEntity = (dto: ProductResponseDto): ProductResponse => ({
  id: dto.id,
  name: dto.name,
  shortName: dto.shortName,
  description: dto.description ?? undefined,
  gtin: dto.gtin,
  barcode: dto.barcode,
  icps: dto.icps,
  productType: dto.productType,
  aggregationQuantity: dto.aggregationQuantity,
  expiration: dto.expiration,
  measurement: {
    unit: dto.measurement.unit,
    amount: dto.measurement.amount,
  },
  weight: {
    net: dto.weight.net,
    gross: dto.weight.gross
  },
  price: dto.price,
  companyId: dto.companyId
});

export const mapUpdateProductDtoToEntity = (dto: UpdateProductDto) : UpdateProduct => ({
  name: dto.name,
  shortName: dto.shortName,
  description: dto.description ?? undefined,
  gtin: dto.gtin,
  barcode: dto.barcode,
  icps: dto.icps,
  productType: dto.productType,
  aggregationQuantity: dto.aggregationQuantity,
  expiration: dto.expiration,
  measurement: dto.measurement ? {
    unit: dto.measurement.unit,
    amount: dto.measurement.amount,
  }: undefined,
  weight: dto.weight ? {
    net: dto.weight.net,
    gross: dto.weight.gross
  }: undefined,
  price: dto.price,
  companyId: dto.companyId
})


export const mapProductResponseDtoToEntity = (dto: ProductResponseDto): UpdateProduct => ({
    name: dto.name,
    shortName: dto.shortName,
    description: dto.description ?? undefined,
    gtin: dto.gtin,
    barcode: dto.barcode,
    icps: dto.icps,
    productType: dto.productType,
    aggregationQuantity: dto.aggregationQuantity,
    expiration: dto.expiration ?? undefined,
    measurement: dto.measurement ? {
        unit: dto.measurement.unit,
        amount: dto.measurement.amount,
    }: undefined,
    weight: dto.weight ? {
        net: dto.weight.net,
        gross: dto.weight.gross
    }: undefined,
    price: dto.price,
    companyId: dto.companyId
});