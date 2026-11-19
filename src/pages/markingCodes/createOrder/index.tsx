import { Alert, Form, Select, InputNumber, Tooltip } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import FormComponent from "shared/ui/formComponent";
import CustomButton from "shared/ui/button";
import type { CreateOrderDto } from '@edem2000/amis.contracts/api/orders/requests';
import { useCreateMarkingCodeOrderMutation } from "entities/markingCodes/api";
import {
  useLazyGetProductByIdQuery,
  useSearchProductsQuery,
} from "entities/products/api";
import { useEffect, useMemo, useState } from "react";
import { useGetReferencesByTypeQuery } from "entities/references/api";
import { getApiErrorMessage } from "shared/api";
import { useParams } from "react-router-dom";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { RequiredDataAlert } from 'entities/access/ui';
import { PackageType } from "shared/types/dtos";
import "./styles.sass";

type OrderFormItem = {
  product?: string;
  packType?: string;
  quantity?: number;
  generation?: string;
};

type OrderFormValues = {
  items: OrderFormItem[];
};

type Product = {
  id: string;
  name: string;
  packageTypes?: string[];
  aggregationQuantity?: number;
};

const packageTypeOrder: Record<string, number> = {
  [PackageType.BoxLv2]: 0,
  [PackageType.BoxLv1]: 1,
  [PackageType.Group]: 2,
  [PackageType.Unit]: 3,
};

const getPackageTypeOrder = (packageType: string) =>
    packageTypeOrder[packageType.toLowerCase()] ?? Number.MAX_SAFE_INTEGER;

type OrderFormProps = {
  /** Заказ создан: закрыть окно и перечитать список. */
  onCreated?: () => void;
};

const OrderForm = ({ onCreated }: OrderFormProps) => {
  const [form] = Form.useForm<OrderFormValues>();
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const orgId = id;
  // const generateOptions = [
  //   { value: "self", label: t("markingCodes.independently") },
  //   { value: "operator", label: t("markingCodes.byOperator") },
  // ];

  const [createMarkingCodeOrder] = useCreateMarkingCodeOrderMutation();
  const {
    data: packTypeReferences = [],
    isFetching: referencesLoading,
    error: packTypeReferencesError,
  } = useGetReferencesByTypeQuery("cisType");

  const [productQuery, setProductQuery] = useState("");
  const {
    data: productsPage,
    isFetching: productsLoading,
    error: productsRequestError,
  } = useSearchProductsQuery({
    query: productQuery,
    page: 1,
    limit: 10,
    sortOrder: "asc",
    companyId: orgId,
  });
  const products = useMemo(() => productsPage?.items ?? [], [productsPage]);
  const [loadProductById, { data: rawProductById }] =
    useLazyGetProductByIdQuery();
  const productsError = productsRequestError
    ? getApiErrorMessage(productsRequestError, t('common.error'))
    : null;
  const referencesError = packTypeReferencesError
    ? getApiErrorMessage(packTypeReferencesError, t('common.error'))
    : null;
  const formItems = Form.useWatch("items", form) ?? [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedProductFieldKey, setFocusedProductFieldKey] = useState<number | null>(null);
  const [productDetailsById, setProductDetailsById] = useState<Record<string, Product>>({});

  const productById: Record<string, Product> = rawProductById
      ? { ...productDetailsById, [rawProductById.id]: rawProductById }
      : productDetailsById;

  useEffect(() => {
    if (!rawProductById) return;

    setProductDetailsById((prev) => ({
      ...prev,
      [rawProductById.id]: rawProductById,
    }));
  }, [rawProductById]);

  const handleProductSearch = (value: string) => {
    if (value.trim()) {
      setProductQuery(value);
    }
  };

  const clearProduct = (rowIndex: number) => {
    form.setFieldValue(["items", rowIndex, "product"], undefined);
    form.setFieldValue(["items", rowIndex, "packType"], undefined);
  };

  const getSuggestedQuantity = (rowIndex: number) => {
    const items = form.getFieldValue("items") ?? [];
    const currentItem = items[rowIndex];

    if (!currentItem?.product || currentItem.packType?.toLowerCase() !== "unit") {
      return null;
    }

    const selectedProduct = productById[currentItem.product];
    const aggregationQuantity = selectedProduct?.aggregationQuantity;

    if (!aggregationQuantity) {
      return null;
    }

    const seniorItem =
        items
            .slice(0, rowIndex)
            .reverse()
            .find((item: OrderFormItem) =>
                item?.product === currentItem.product &&
                item?.packType &&
                item.packType.toLowerCase() !== "unit" &&
                Number(item.quantity) > 0
            ) ??
        items.find((item: OrderFormItem, index: number) =>
            index !== rowIndex &&
            item?.product === currentItem.product &&
            item?.packType &&
            item.packType.toLowerCase() !== "unit" &&
            Number(item.quantity) > 0
        );

    if (!seniorItem) {
      return null;
    }

    return Number(seniorItem.quantity) * aggregationQuantity;
  };

  const isPackageTypeSelectedForProduct = (
      rowIndex: number,
      productId: string,
      packageType: string
  ) => {
    const items = form.getFieldValue("items") ?? [];

    return items.some((item: OrderFormItem, index: number) =>
        index !== rowIndex &&
        item?.product === productId &&
        item?.packType?.toLowerCase() === packageType.toLowerCase()
    );
  };

  const hasDifferentSelectedProducts = () => {
    const items = form.getFieldValue("items") ?? [];
    const selectedProductIds = new Set(
        items
            .map((item: OrderFormItem) => item?.product)
            .filter(Boolean)
    );

    return selectedProductIds.size > 1;
  };

  const handleCreateMarkingCode = async (values: OrderFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload: CreateOrderDto = {
      products: values.items.map((item) => ({
        id: item.product!,
        quantity: item.quantity!,
        packageType: item.packType!,
        serialNumberType: item.generation ?? "operator",
      })),
    };

    try {
      await createMarkingCodeOrder(payload).unwrap();
      toast.success(t("markingCodes.orderCreation.orderHasBeenSuccessfullyCreated"));
      form.resetFields();
      onCreated?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, t('common.error')));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <RequiredDataAlert
        endpoints={[
          endpointAccessMap.referencesRead,
          endpointAccessMap.productsList,
          endpointAccessMap.productsRead,
        ]}
        errors={[referencesError, productsError]}
      />
      <FormComponent form={form} onFinish={handleCreateMarkingCode}>
        <Form.List name="items" initialValue={[{}]}>
          {(fields, { add, remove }) => (
              <div className="create-order-items marking-code-create-order-items">
                {fields.map((field, index) => {
                  const selectedProductId = formItems[field.name]?.product;
                  const shouldShowProductClear = Boolean(selectedProductId) && focusedProductFieldKey === field.key;

                  return (
                    <div key={field.key} className="form-inputs create-order-items-item">

                      <Form.Item
                          className="input"
                          name={[field.name, "product"]}
                          rules={[{ required: true, message: t("markingCodes.label.chooseProduct") }]}
                      >
                        <Select
                            className={shouldShowProductClear ? "marking-code-product-select has-product-clear" : "marking-code-product-select"}
                            size="large"
                            placeholder={t("markingCodes.orderCreation.product")}
                            showSearch
                            style={{maxWidth: 250, width: "100%", minWidth: 250}}
                            filterOption={false}
                            optionLabelProp="label"
                            dropdownMatchSelectWidth={false}
                            suffixIcon={
                              shouldShowProductClear ? (
                                  <CloseOutlined
                                      className="marking-code-product-clear"
                                      onMouseDown={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        clearProduct(field.name);
                                      }}
                                  />
                              ) : undefined
                            }
                            onFocus={() => setFocusedProductFieldKey(field.key)}
                            onBlur={() => setFocusedProductFieldKey(null)}
                            onInputKeyDown={(event) => {
                              if (event.key !== "Backspace" || !selectedProductId) return;

                              event.preventDefault();
                              clearProduct(field.name);
                            }}
                            onSearch={handleProductSearch}
                            onChange={(productId) => {
                              form.setFieldValue(["items", field.name, "packType"], undefined);
                              void loadProductById({ id: productId });
                            }}
                            options={products.map((product) => ({
                              value: product.id,
                              label: product.name,
                            }))}
                        />
                      </Form.Item>

                      <Form.Item
                          noStyle
                          shouldUpdate={(prev, cur) =>
                              prev.items !== cur.items
                          }
                      >
                        {() => {
                          const productId = form.getFieldValue(["items", field.name, "product"]);
                          const selectedProduct = productById[productId];

                          if (!productId || !selectedProduct) {
                            return (
                                <Form.Item
                                    className="input"
                                    name={[field.name, "packType"]}
                                    rules={[{ required: true, message: t("markingCodes.label.choosePackageType") }]}
                                >
                                  <Select
                                      size="large"
                                      style={{ maxWidth: 250, width: "100%", minWidth: 250}}
                                      loading
                                      placeholder={t("markingCodes.orderCreation.packagingType")}
                                  />
                                </Form.Item>
                            );
                          }

                          const allowedPackageTypes = selectedProduct.packageTypes ?? [];
                          const normalizedAllowed = allowedPackageTypes.map((t) => t.toUpperCase());

                          const packTypeOptions = packTypeReferences
                              .filter((ref) => normalizedAllowed.includes(ref.alias.toUpperCase()))
                              .sort((left, right) =>
                                  getPackageTypeOrder(left.alias) - getPackageTypeOrder(right.alias)
                              )
                              .map((ref) => ({
                                value: ref.alias,
                                label:
                                    typeof ref.title === "string"
                                        ? ref.title
                                        : ref.title[i18n.language as keyof typeof ref.title] ?? ref.title.en,
                                disabled: isPackageTypeSelectedForProduct(field.name, productId, ref.alias),
                              }));

                          return (
                              <Form.Item
                                  className="input"
                                  name={[field.name, "packType"]}
                                  rules={[
                                    { required: true, message: t("markingCodes.label.choosePackageType") },
                                    {
                                      validator: (_, value) => {
                                        if (!value || !productId) {
                                          return Promise.resolve();
                                        }

                                        if (isPackageTypeSelectedForProduct(field.name, productId, value)) {
                                          return Promise.reject(new Error(t("markingCodes.label.duplicatePackageType")));
                                        }

                                        return Promise.resolve();
                                      },
                                    },
                                  ]}
                              >
                                <Select
                                    size="large"
                                    style={{ maxWidth: 250, width: "100%", minWidth: 250}}
                                    options={packTypeOptions}
                                    placeholder={t("markingCodes.orderCreation.packagingType")}
                                />
                              </Form.Item>
                          );
                        }}
                      </Form.Item>

                      <Form.Item
                          noStyle
                          shouldUpdate
                      >
                        {() => {
                          const suggestedQuantity = getSuggestedQuantity(field.name);
                          const quantityField = (
                              <Form.Item
                                  className="input"
                                  name={[field.name, "quantity"]}
                                  rules={[{ required: true, message: t("markingCodes.label.enterQuantity") }]}
                              >
                                <InputNumber
                                    min={1}
                                    size="large"
                                    style={{ width: "100%", minWidth: 50 }}
                                    placeholder="0"
                                  />
                              </Form.Item>
                          );

                          return suggestedQuantity !== null ? (
                              <Tooltip
                                  title={suggestedQuantity}
                                  placement="top"
                                  styles={{ body: { paddingInline: 16 } }}
                              >
                                <span style={{ display: "inline-block", width: "100%" }}>
                                  {quantityField}
                                </span>
                              </Tooltip>
                          ) : quantityField;
                        }}
                      </Form.Item>

                      {/* <Form.Item
                        className="input"
                        name={[field.name, "generation"]}
                        initialValue="operator"
                        rules={[{ required: true, message: t("markingCodes.label.chooseGenerationMethod") }]}
                      >
                        <Select
                          size="large"
                          style={{ maxWidth: 150, width: "100%", minWidth: 150 }}
                          options={generateOptions}
                        />
                      </Form.Item> */}

                      <div className="marking-code-create-order-actions">
                        <span className="marking-code-create-order-action-slot">
                          {index === fields.length - 1 && (
                            <CustomButton
                                className="create-order-btn"
                                icon={<PlusOutlined />}
                                iconOnly
                                onClick={() => add()}
                                aria-label={t("btn.add", { defaultValue: "Добавить" })}
                            />
                          )}
                        </span>

                        <span className="marking-code-create-order-action-slot">
                          {fields.length > 1 && (
                            <CustomButton
                                className="create-order-btn"
                                variant="danger"
                                icon={<CloseOutlined />}
                                iconOnly
                                onClick={() => remove(field.name)}
                                aria-label={t("btn.delete", { defaultValue: "Удалить" })}
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
          )}
        </Form.List>

        <Form.Item noStyle shouldUpdate>
          {() => (
              hasDifferentSelectedProducts() && (
                  <Alert
                      type="info"
                      showIcon
                      message={t("markingCodes.orderCreation.differentProductsWarning")}
                  />
              )
          )}
        </Form.Item>

        <CustomButton
            disabled={
                isSubmitting ||
                referencesLoading ||
                productsLoading ||
                Boolean(referencesError) ||
                Boolean(productsError)
            }
            type="submit"
            variant="outline"
        >
          {t("markingCodes.orderCreation.submitOrder")}
        </CustomButton>
      </FormComponent>
    </>
  );
};

export default OrderForm;



