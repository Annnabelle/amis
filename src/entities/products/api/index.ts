import type {
  DeleteProductDto,
  GetProductDto,
  GetProductsDto,
  UpdateProductDto,
} from "@edem2000/amis.contracts/api/products/requests";
import type {
  CreateProductResponseDto,
  GetProductPackagesResponseDto,
  GetProductResponseDto,
} from "@edem2000/amis.contracts/api/products/responses";
import {
  mapProductDtoToEntity,
  mapProductPackageDtoToEntity,
} from "entities/products/mappers";
import type {
  CreateProduct,
  Product,
  ProductList,
  ProductPackage,
} from "entities/products/types";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  toPaginated,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const listTag = [{ type: ApiTags.Product, id: LIST_TAG_ID }];

type SearchProductsParams = {
  query: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  companyId?: string;
};

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductList, GetProductsDto>({
      query: (params) => request(endpointAccessMap.productsList, { params }),
      transformResponse: toPaginated(mapProductDtoToEntity),
      providesTags: listTag,
    }),

    searchProducts: build.query<ProductList, SearchProductsParams>({
      query: ({ query, page = 1, limit = 10, sortOrder = "asc", companyId }) =>
        request(endpointAccessMap.productsSearch, {
          params: { query, page, limit, sortOrder, companyId },
        }),
      transformResponse: toPaginated(mapProductDtoToEntity),
      /** Поиск показывает те же записи, что список: мутация устаревает и его. */
      providesTags: listTag,
    }),

    getProductById: build.query<Product, GetProductDto>({
      query: ({ id }) =>
        request(endpointAccessMap.productsRead, { pathParams: { id } }),
      transformResponse: (response: SuccessOf<GetProductResponseDto>) =>
        mapProductDtoToEntity(response.product),
      providesTags: (_result, _error, { id }) => [
        { type: ApiTags.Product, id },
      ],
    }),

    getProductPackages: build.query<ProductPackage[], { id: string }>({
      query: ({ id }) =>
        request(endpointAccessMap.productsPackages, { pathParams: { id } }),
      transformResponse: (
        response: SuccessOf<GetProductPackagesResponseDto>
      ) => response.packages.map(mapProductPackageDtoToEntity),
    }),

    createProduct: build.mutation<Product, CreateProduct>({
      query: (data) => request(endpointAccessMap.productsCreate, { data }),
      transformResponse: (response: SuccessOf<CreateProductResponseDto>) =>
        mapProductDtoToEntity(response.product),
      invalidatesTags: listTag,
    }),

    updateProduct: build.mutation<Product, { id: string; data: UpdateProductDto }>({
      query: ({ id, data }) =>
        request(endpointAccessMap.productsUpdate, { pathParams: { id }, data }),
      transformResponse: (response: SuccessOf<GetProductResponseDto>) =>
        mapProductDtoToEntity(response.product),
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.Product, id },
        ...listTag,
      ],
    }),

    deleteProduct: build.mutation<void, DeleteProductDto>({
      query: ({ id }) =>
        request(endpointAccessMap.productsDelete, { pathParams: { id } }),
      transformResponse: (): void => undefined,
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.Product, id },
        ...listTag,
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useGetProductPackagesQuery,
  useLazyGetProductPackagesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
