import type { ProductResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { CreateProductResponseDto, ProductPackageResponseDto } from '@edem2000/amis.contracts/api/products/responses';
import type { CreateProductRequestDto, UpdateProductRequestDto } from 'entities/products/dtos';
import type { CreateProduct, ProductPackage, Product, UpdateProduct } from "entities/products/types";
import type {ErrorDto} from "shared/types/dtos";


export function mapCreateProductToCreateProductDto(form: CreateProduct ) : CreateProductRequestDto {
    return {
        name: form.name,
        shortName: form.shortName,
        description: form.description,
        gtin: {
            unit: form.gtin.unit,
            group: form.gtin.group,
            box_lv_1: form.gtin.box_lv_1,
            box_lv_2: form.gtin.box_lv_2,
        },
        icps: form.icps,
        productType: form.productType,
        manufacturerCountry: form.manufacturerCountry,
        aggregationQuantity: form.aggregationQuantity,
        expiration: form.expiration,
        measurement: {
            unit: form.measurement.unit,
            amount: form.measurement.amount
        },
        weight: {
            net: form.weight.net,
            gross: form.weight.gross
        },
        price: form.price,
        companyId: form.companyId,
    }
}

export const mapProductDtoToEntity = (dto: ProductResponseDto): Product => ({
  id: dto.id,
  name: dto.name,
  shortName: dto.shortName,
  description: dto.description ?? undefined,
  gtin: {
      unit: dto.gtin.unit,
      group: dto.gtin.group,
      box_lv_1: dto.gtin.box_lv_1,
      box_lv_2: dto.gtin.box_lv_2,
  },
    classification: dto.classification
      ? {
          icps: dto.classification.icps,
          name: dto.classification.name,
          source: dto.classification.source,
          resolvedAt: new Date(dto.classification.resolvedAt),
        }
      : null,
    brand: dto.brand,
    productGroup: dto.productGroup,
    packageTypes: dto.packageTypes,

    aggregationQuantity: dto.aggregationQuantity,
    expiration: dto.expiration,
    manufacturerCountry: dto.manufacturerCountry,

    measurement: dto.measurement &&{
        unit: dto.measurement.unit,
        amount: dto.measurement.amount
    },
    weight: dto.weight &&{
        net: dto.weight.net,
        gross: dto.weight.gross,
    },
    price: dto.price,
    companyId: dto.companyId,
});

export const mapProductPackageDtoToEntity = (dto: ProductPackageResponseDto): ProductPackage => ({
  code: dto.code,
  icps: dto.icps,
  type: dto.type,
  name: dto.name,
});

export function mapCreateProductResponseResponse(
    dto: CreateProductResponseDto
): { success: boolean; product?: ProductResponseDto; error?: ErrorDto } {
    // если dto содержит поле errorCode или errorMessage, считаем это ошибкой
    if ('errorCode' in dto || 'errorMessage' in dto) {
        return { success: false, error: dto as ErrorDto };
    }

    // иначе это успешный ответ с репортами
    return {
        success: dto.success,
        product: dto.product,
    };
}

export const mapUpdateProductDtoToEntity = (dto: UpdateProductRequestDto) : UpdateProduct => ({
  name: dto.name ?? undefined,
  shortName: dto.shortName ?? undefined,
  description: dto.description ?? undefined,
  gtin: dto.gtin ? {
      unit: dto.gtin.unit,
      group: dto.gtin.group,
      box_lv_1: dto.gtin.box_lv_1,
      box_lv_2: dto.gtin.box_lv_2,
  } : undefined,
  icps: dto.icps ?? undefined,
  productType: dto.productType ?? undefined,
  aggregationQuantity: dto.aggregationQuantity ?? undefined,
  expiration: dto.expiration ?? undefined,
  measurement: dto.measurement ? {
    unit: dto.measurement.unit,
    amount: dto.measurement.amount,
  }: undefined,
  weight: dto.weight ? {
    net: dto.weight.net,
    gross: dto.weight.gross
  }: undefined,
  price: dto.price ?? undefined,
  companyId: dto.companyId ?? undefined
})




