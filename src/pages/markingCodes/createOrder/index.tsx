import { Alert, Form, Select, InputNumber, Button, Tooltip } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import FormComponent from "shared/ui/formComponent";
import CustomButton from "shared/ui/button";
import { useAppDispatch, useAppSelector } from "app/store";
import type { CreateOrderDto } from "entities/markingCodes/dtos";
import { createOrder } from "entities/markingCodes/model";
import { searchProducts, getProductById } from "entities/products/model";
import { useEffect, useState } from "react";
import { fetchReferencesByType } from "entities/references/model";
import { useParams } from "react-router-dom";
import {getBackendErrorMessage} from "shared/lib/getBackendErrorMessage.ts";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { RequiredDataAlert } from 'entities/access/ui';

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

const OrderForm = () => {
  const [form] = Form.useForm<OrderFormValues>();
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const orgId = id;
  const dispatch = useAppDispatch();
  const generateOptions = [
    { value: "self", label: t("markingCodes.independently") },
    { value: "operator", label: t("markingCodes.byOperator") },
  ];

  const packTypeReferences =
      useAppSelector((state) => state.references.references.cisType) ?? [];

  const {
    products,
    productById: rawProductById,
    isLoading: productsLoading,
    error: productsError,
  } = useAppSelector(
      (state) => state.products
  );
  const referencesLoading = useAppSelector((state) => state.references.loading);
  const referencesError = useAppSelector((state) => state.references.error);

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    dispatch(fetchReferencesByType("cisType"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(searchProducts({ query: "", page: 1, limit: 10, sortOrder: "asc" }));
  }, [dispatch]);

  const handleProductSearch = (value: string) => {
    if (value.trim()) {
      dispatch(searchProducts({ query: value, page: 1, limit: 10, sortOrder: "asc" }));
    }
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
      companyId: orgId!,
      products: values.items.map((item) => ({
        id: item.product!,
        quantity: item.quantity!,
        packageType: item.packType!,
        serialNumberType: item.generation!,
      })),
    };

    const resultAction = await dispatch(createOrder(payload));

    if (createOrder.fulfilled.match(resultAction)) {
      toast.success(t("markingCodes.orderCreation.orderHasBeenSuccessfullyCreated"));
      setTimeout(() => window.location.reload(), 1000);
    } else if (createOrder.rejected.match(resultAction)) {
      toast.error(
          getBackendErrorMessage(resultAction.payload, t('common.error'))
      );
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
              <div className="create-order-items">
                {fields.map((field, index) => (
                    <div key={field.key} className="form-inputs create-order-items-item">

                      <Form.Item
                          className="input"
                          name={[field.name, "product"]}
                          rules={[{ required: true, message: t("markingCodes.label.chooseProduct") }]}
                      >
                        <Select
                            size="large"
                            placeholder={t("markingCodes.orderCreation.product")}
                            showSearch
                            style={{maxWidth: 250, width: "100%", minWidth: 250}}
                            filterOption={false}
                            optionLabelProp="label"
                            dropdownMatchSelectWidth={false}
                            onSearch={handleProductSearch}
                            onChange={(productId) => {
                              form.setFieldValue(["items", field.name, "packType"], undefined);
                              dispatch(getProductById({ id: productId }));
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
                          const suggestedQuantity = getSuggestedQuantity(index);
                          const inputNumber = (
                              <InputNumber
                                  min={1}
                                  size="large"
                                  style={{ width: "100%", minWidth: 50 }}
                                  placeholder="0"
                              />
                          );

                          return (
                              <Form.Item
                                  className="input"
                                  name={[field.name, "quantity"]}
                                  rules={[{ required: true, message: t("markingCodes.label.enterQuantity") }]}
                              >
                                {suggestedQuantity ? (
                                    <Tooltip
                                        title={suggestedQuantity}
                                        placement="top"
                                        styles={{ body: { paddingInline: 16 } }}
                                    >
                                      <span style={{ display: "inline-block", width: "100%" }}>
                                        {inputNumber}
                                      </span>
                                    </Tooltip>
                                ) : inputNumber}
                              </Form.Item>
                          )
                        }}
                      </Form.Item>

                      <Form.Item
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
                      </Form.Item>

                      {index === fields.length - 1 ? (
                          <Button type="primary" className="create-order-btn" icon={<PlusOutlined />} onClick={() => add()} />
                      ) : (
                          <Button danger className="create-order-btn" icon={<CloseOutlined />} onClick={() => remove(field.name)} />
                      )}
                    </div>
                ))}
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
            className="outline full-width"
        >
          {t("markingCodes.orderCreation.submitOrder")}
        </CustomButton>
      </FormComponent>
    </>
  );
};

export default OrderForm;



