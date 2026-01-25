import type {
    CreateProductDto,
    CreateProductResponseDto,
    ProductResponseDto,
    UpdateProductDto
} from "../../dtos/products";
import type { CreateProduct, ProductResponse, UpdateProduct } from "../../types/products";
import type {ErrorDto} from "../../dtos";


export function mapCreateProductToCreateProductDto(form: CreateProduct ) : CreateProductDto {
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

export const mapProductDtoToEntity = (dto: ProductResponseDto): ProductResponse => ({
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
    icps: dto.icps,
    productType: dto.productType,
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

export const mapUpdateProductDtoToEntity = (dto: UpdateProductDto) : UpdateProduct => ({
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