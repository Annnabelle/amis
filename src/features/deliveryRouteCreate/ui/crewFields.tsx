import { AutoComplete, Form, Input, type FormInstance } from "antd";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { CompanyRole, type CompanyMembership } from "entities/companyMemberships/types";

/** Вариант в подсказке экипажа: кроме подписи нужен id сотрудника. */
export type CrewMemberOption = {
  value: string;
  userId: string;
};

type CrewFieldsProps = {
  form: FormInstance;
  memberships: CompanyMembership[];
  onSearch: (value: string, role: CompanyRole) => void;
};

/**
 * Водитель и агент рейса.
 *
 * Имя вводят с подсказкой по сотрудникам компании: в рейс уходит выбранный
 * сотрудник, поэтому рядом с именем сохраняется его идентификатор.
 */
const CrewFields = ({ form, memberships: searchedMemberships, onSearch: handleUserSearch }: CrewFieldsProps) => {
  const { t } = useTranslation();
  /** Выбор из подсказки не должен сбрасывать id, который он же и проставил. */
  const isSelectingDriverRef = useRef(false);
  const isSelectingAgentRef = useRef(false);

  return (
      <div className="form-inputs form-inputs-organization">
        <Form.Item className="input" name={["crew", "driverName"]} label={t('deliveryRoutes.fields.driver')}>
          <AutoComplete<string, CrewMemberOption>
            className="input"
            size="large"
            placeholder={t('deliveryRoutes.placeholders.driver')}
            filterOption={false}
            allowClear
            onSearch={(value) => handleUserSearch(value, CompanyRole.Driver)}
            options={searchedMemberships.map((membership) => ({
              value: `${membership.user?.firstName ?? ''} ${membership.user?.lastName ?? ''}`.trim(),
              userId: membership.userId,
            }))}
            onSelect={(value, option) => {
              isSelectingDriverRef.current = true;
              const currentCrew = form.getFieldValue('crew') || {};
              form.setFieldsValue({
                crew: {
                  ...currentCrew,
                  driverName: value,
                  driverId: option.userId,
                },
              });
              setTimeout(() => {
                isSelectingDriverRef.current = false;
              }, 0);
            }}
            onChange={(value) => {
              if (isSelectingDriverRef.current) {
                isSelectingDriverRef.current = false;
                return;
              }

              const currentCrew = form.getFieldValue('crew') || {};
              form.setFieldsValue({
                crew: {
                  ...currentCrew,
                  driverName: value?.toString() || undefined,
                  driverId: undefined,
                },
              });
            }}
            onClear={() => {
              const currentCrew = form.getFieldValue('crew') || {};
              form.setFieldsValue({
                crew: {
                  ...currentCrew,
                  driverName: undefined,
                  driverId: undefined,
                },
              });
            }}
          />
        </Form.Item>
        <Form.Item className="input" name={["crew", "driverId"]} hidden>
          <Input />
        </Form.Item>

        <Form.Item className="input" name={["crew", "agentName"]} label={t('deliveryRoutes.fields.agent')}>
          <AutoComplete<string, CrewMemberOption>
            className="input"
            size="large"
            placeholder={t('deliveryRoutes.placeholders.agent')}
            filterOption={false}
            allowClear
            onSearch={(value) => handleUserSearch(value, CompanyRole.DeliveryAgent)}
            options={searchedMemberships.map((membership) => ({
              value: `${membership.user?.firstName ?? ''} ${membership.user?.lastName ?? ''}`.trim(),
              userId: membership.userId,
            }))}
            onSelect={(value, option) => {
              isSelectingAgentRef.current = true;
              const currentCrew = form.getFieldValue('crew') || {};
              form.setFieldsValue({
                crew: {
                  ...currentCrew,
                  agentName: value,
                  agentId: option.userId,
                },
              });
              setTimeout(() => {
                isSelectingAgentRef.current = false;
              }, 0);
            }}
            onChange={(value) => {
              if (isSelectingAgentRef.current) {
                isSelectingAgentRef.current = false;
                return;
              }

              const currentCrew = form.getFieldValue('crew') || {};
              form.setFieldsValue({
                crew: {
                  ...currentCrew,
                  agentName: value?.toString() || undefined,
                  agentId: undefined,
                },
              });
            }}
            onClear={() => {
              const currentCrew = form.getFieldValue('crew') || {};
              form.setFieldsValue({
                crew: {
                  ...currentCrew,
                  agentName: undefined,
                  agentId: undefined,
                },
              });
            }}
          />
        </Form.Item>
        <Form.Item className="input" name={["crew", "agentId"]} hidden>
          <Input />
        </Form.Item>
      </div>
  );
};

export default CrewFields;
