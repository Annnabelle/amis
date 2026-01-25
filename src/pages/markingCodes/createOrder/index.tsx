import { Form, Select, InputNumber, Button } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import FormComponent from "../../../components/formComponent";
import CustomButton from "../../../components/button";
import { useAppDispatch, useAppSelector } from "../../../store";
import type { CreateOrderDto } from "../../../dtos/markingCodes";
import { createOrder } from "../../../store/markingCodes";
import { searchProducts, getProductById } from "../../../store/products";
import { useEffect, useState } from "react";
import { fetchReferencesByType } from "../../../store/references";
import { useParams } from "react-router-dom";
import {getBackendErrorMessage} from "../../../utils/getBackendErrorMessage.ts";

type OrderFormValues = {
  items: {
    product: string;
    packType: string;
    quantity: number;
    generation: string;
  }[];
};

type Product = {
  id: string;
  name: string;
  packageTypes?: string[];
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

  const { products, productById: rawProductById } = useAppSelector(
      (state) => state.products
  );

  // --- безопасный объект productById для TS ---
  const productById: Record<string, Product> = rawProductById
      ? { [rawProductById.id]: rawProductById }
      : {};

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Загрузка справочников ---
  useEffect(() => {
    dispatch(fetchReferencesByType("cisType"));
  }, [dispatch]);

  // --- Начальный поиск продуктов ---
  useEffect(() => {
    dispatch(searchProducts({ query: "", page: 1, limit: 10, sortOrder: "asc" }));
  }, [dispatch]);

  // --- Поиск продуктов при вводе ---
  const handleProductSearch = (value: string) => {
    if (value.trim()) {
      dispatch(searchProducts({ query: value, page: 1, limit: 10, sortOrder: "asc", companyId: orgId }));
    }
  };

  const handleCreateMarkingCode = async (values: OrderFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload: CreateOrderDto = {
      companyId: orgId!,
      products: values.items.map((item) => ({
        id: item.product,
        quantity: item.quantity,
        packageType: item.packType,
        serialNumberType: item.generation,
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
      <FormComponent form={form} onFinish={handleCreateMarkingCode}>
        <Form.List name="items" initialValue={[{}]}>
          {(fields, { add, remove }) => (
              <div className="create-order-items">
                {fields.map((field, index) => (
                    <div key={field.key} className="form-inputs create-order-items-item">

                      {/* --- Product select --- */}
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

                      {/* --- PackType select --- */}
                      <Form.Item
                          noStyle
                          shouldUpdate={(prev, cur) =>
                              prev.items?.[field.name]?.product !== cur.items?.[field.name]?.product
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
                              }));

                          return (
                              <Form.Item
                                  className="input"
                                  name={[field.name, "packType"]}
                                  rules={[{ required: true, message: t("markingCodes.label.choosePackageType") }]}
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

                      {/* --- Quantity --- */}
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

                      {/* --- Generation --- */}
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

                      {/* --- Add/Remove buttons --- */}
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

        <CustomButton disabled={isSubmitting} type="submit" className="outline full-width">
          {t("markingCodes.orderCreation.submitOrder")}
        </CustomButton>
      </FormComponent>
  );
};

export default OrderForm;
