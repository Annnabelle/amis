import { Form, Select, InputNumber, Button } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import FormComponent from "../../../components/formComponent";
import CustomButton from "../../../components/button";
import { useAppDispatch, useAppSelector } from "../../../store";
import type { CreateOrderDto } from "../../../dtos/markingCodes";
import { createOrder } from "../../../store/markingCodes";
import { searchProducts } from "../../../store/products";
import { useEffect, useMemo } from "react";
import { fetchReferencesByType } from "../../../store/references";

type OrderFormValues = {
  items: {
    product: string; 
    packType: string;
    quantity: number;
    generation: string;
  }[];
};

const generateOptions = [
  { value: "self", label: "Самостоятельно" },
  { value: "operator", label: "Оператором" },
];

const OrderForm = () => {
  const [form] = Form.useForm<OrderFormValues>();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const packTypeReferences =
      useAppSelector(state => state.references.references.cisType) ?? []
  const { products } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchReferencesByType("cisType"));
  }, [dispatch]);

  console.log("packTypeReferences", packTypeReferences)

  const handleProductSearch = (value: string) => {
    if (value.trim()) {
      dispatch(
        searchProducts({
          query: value,
          page: 1,
          limit: 10,
          sortOrder: "asc",
        })
      );
    }
  };

  const packageTypeOptions = useMemo(() => {
    return packTypeReferences.map((ref) => ({
      value: ref.alias,
      label: typeof ref.title === "string"
          ? ref.title
          : ref.title[i18n.language as keyof typeof ref.title] ?? ref.title.en,
    }));
  }, [packTypeReferences, i18n.language]);


  // 📤 Отправка формы
  const handleCreateMarkingCode = async (values: OrderFormValues) => {
    const payload: CreateOrderDto = {
      products: values.items.map((item) => ({
        id: item.product,
        quantity: item.quantity,
        packageType: item.packType,
        serialNumberType: item.generation,
      })),
    };

    try {
      const resultAction = await dispatch(createOrder(payload));

      if (createOrder.fulfilled.match(resultAction)) {
        toast.success(
          t("markingCodes.orderCreation.orderHasBeenSuccessfullyCreated")
        );
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(t("markingCodes.messages.error.createOrder"));
      }
    } catch (error) {
      toast.error(
        (error as string) ||
          t("markingCodes.orderCreation.failedToCreateOrder")
      );
    }
  };

  return (
    <FormComponent form={form} onFinish={handleCreateMarkingCode}>
      <Form.List name="items" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <div className="create-order-items">
            {fields.map((field, index) => (
              <div
                key={field.key}
                className="form-inputs create-order-items-item"
              >
                <Form.Item
                    className="input"
                    name={[field.name, "product"]}
                    rules={[
                      {
                        required: true,
                        message: t("markingCodes.label.chooseProduct"),
                      },
                    ]}
                >
                  <Select
                      size="large"
                      className="input"
                      style={{maxWidth: 250, width: "100%", minWidth: 250}}
                      showSearch
                      placeholder={t("markingCodes.orderCreation.product")}
                      filterOption={false}
                      optionLabelProp="label"// 🔥 ВАЖНО
                      dropdownMatchSelectWidth={false}
                      onSearch={handleProductSearch}
                      options={products.map((product) => ({
                        value: product.id,     // 🆔 отправляем ID
                        label: product.name,   // 👀 показываем NAME
                      }))}
                  />
                </Form.Item>

                <Form.Item
                  className="input"
                  name={[field.name, "packType"]}
                  rules={[
                    {
                      required: true,
                      message: t("markingCodes.label.choosePackageType"),
                    },
                  ]}
                >
                  <Select
                    size="large"
                    options={packageTypeOptions}
                    style={{ maxWidth: 250, width: "100%", minWidth: 250}}
                    placeholder={t(
                      "markingCodes.orderCreation.packagingType"
                    )}
                  />
                </Form.Item>

                <Form.Item
                  className="input"
                  name={[field.name, "quantity"]}
                  rules={[
                    {
                      required: true,
                      message: t("markingCodes.label.enterQuantity"),
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    size="large"
                    style={{ width: "100%", minWidth: 50 }}
                    placeholder="0"
                  />
                </Form.Item>

                <Form.Item
                  className="input"
                  name={[field.name, "generation"]}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "markingCodes.label.chooseGenerationMethod"
                      ),
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ maxWidth: 150, width: "100%", minWidth: 150}}
                    options={generateOptions}
                    placeholder={t(
                      "markingCodes.orderCreation.serialNumberGenerationMethod"
                    )}
                  />
                </Form.Item>

                {index === fields.length - 1 ? (
                  <Button
                    type="primary"
                    className="create-order-btn"
                    icon={<PlusOutlined />}
                    onClick={() => add()}
                  />
                ) : (
                  <Button
                    danger
                    className="create-order-btn"
                    icon={<CloseOutlined />}
                    onClick={() => remove(field.name)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </Form.List>

      <CustomButton type="submit" className="outline full-width">
        {t("markingCodes.orderCreation.submitOrder")}
      </CustomButton>
    </FormComponent>
  );
};

export default OrderForm;


