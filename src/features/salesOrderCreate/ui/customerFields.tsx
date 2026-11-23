import { Form, Input, Spin } from "antd";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import {
  allowOnlyDigitsKeyDown,
  allowOnlyDigitsPaste,
} from "features/salesOrderCreate/lib/numericInput";

/** ИНН компании в Узбекистане — девять цифр. */
const TIN_LENGTH = 9;

type CustomerFieldsProps = {
  onTinChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isSearching: boolean;
};

/**
 * Реквизиты получателя: ИНН ищет компанию, название подставляется найденным.
 *
 * Заказ выписывается на заведённую компанию, поэтому поле ИНН проверяется
 * поиском, а не только форматом.
 */
const CustomerFields = ({
  onTinChange: handleTinChange,
  isSearching: isSearchingCompany,
}: CustomerFieldsProps) => {
  const { t } = useTranslation();

  return (
      <div className="form-inputs form-inputs-organization">
        <Form.Item
          name={["customer", "id"]}
          hidden
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="input"
          name={["customer", "tin"]}
          label={t('salesOrders.createFields.companyTin', { defaultValue: 'ИНН компании' })}
          rules={[
            {
              required: true,
              message: t('salesOrders.validation.customerTinRequired'),
            },
            {
              validator: async (_, value) => {
                const tin = String(value ?? '').trim();

                if (!tin) {
                  return Promise.resolve();
                }

                if (!/^\d+$/.test(tin)) {
                  return Promise.reject(new Error(t('salesOrders.validation.customerTinDigitsOnly')));
                }

                if (tin.length !== TIN_LENGTH) {
                  return Promise.reject(new Error(t('salesOrders.validation.customerTinLength')));
                }

                if (/^0+$/.test(tin)) {
                  return Promise.reject(new Error(t('salesOrders.validation.customerTinInvalid')));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            className="input"
            size="large"
            maxLength={TIN_LENGTH}
            inputMode="numeric"
            autoComplete="off"
            onChange={handleTinChange}
            onKeyDown={allowOnlyDigitsKeyDown(TIN_LENGTH)}
            onPaste={allowOnlyDigitsPaste(TIN_LENGTH)}
            suffix={isSearchingCompany ? <Spin size="small" /> : undefined}
            placeholder={t('salesOrders.createPlaceholders.companyTin', {
              defaultValue: 'ИНН компании',
            })}
          />
        </Form.Item>
        <Form.Item
          className="input"
          name={["customer", "name"]}
          label={t('salesOrders.createFields.companyName', { defaultValue: 'Название компании' })}
          rules={[
            {
              required: true,
              message: t('salesOrders.createValidation.companyNameRequired', {
                defaultValue: 'Название компании обязательно',
              }),
            },
          ]}
        >
          <Input
            className="input"
            size="large"
            placeholder={t('salesOrders.createPlaceholders.companyName', {
              defaultValue: 'Название компании',
            })}
          />
        </Form.Item>
      </div>
  );
};

export default CustomerFields;
