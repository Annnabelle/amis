import {
  ApartmentOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";

export type TargetFieldConfig = { label: string; icon: ReactElement };

/**
 * Подпись и значок поля цели события.
 *
 * Ключ — путь поля: у вложенных он идёт через точку, как и в самой записи.
 */
export const useTargetFieldMap = (): Record<string, TargetFieldConfig> => {
  const { t } = useTranslation();

  return {
    // User
    fullName: { label: t('users.addUserForm.label.firstName'), icon: <UserOutlined style={{ color: "var(--main-primary)" }} /> },
    lastName: { label: t('users.addUserForm.label.lastName'), icon: <UserOutlined style={{ color: "var(--main-primary)" }} /> },
    email: { label: t('users.addUserForm.label.email'), icon: <MailOutlined style={{ color: "var(--status-cyan-color)" }} /> },
    phone: { label: t('users.addUserForm.label.phone'), icon: <PhoneOutlined style={{ color: "var(--status-success-color)" }} /> },
    lastLoggedInAt: { label: t('users.addUserForm.label.lastLoggedInAt'), icon: <ClockCircleOutlined style={{ color: "var(--status-warning-color)" }} /> },
    // status: { label: "Статус", icon: <TagOutlined style={{ color: "var(--main-primary)" }} /> },

    // Company
    displayName: { label: t('organizations.addUserForm.label.displayName'), icon: <TagOutlined /> },
    legalName: { label: t('organizations.addUserForm.label.legalName'), icon: <TagOutlined /> },
    tin: { label: t('organizations.addUserForm.label.tin'), icon: <TagOutlined /> },
    director: { label: t('organizations.addUserForm.label.director'), icon: <UserOutlined /> },
    companyType: { label: t('organizations.addUserForm.label.companyType'), icon: <TagOutlined /> },
    productGroup: { label:t('organizations.addUserForm.label.productGroup'), icon: <TagOutlined /> },
    status: { label: t('organizations.addUserForm.label.status'), icon: <TagOutlined /> },
    deleted: { label: t('organizations.addUserForm.label.deleted'), icon: <TagOutlined /> },
    // deletedAt: { label: t('organizations.addUserForm.label.deletedAt'), icon: <ClockCircleOutlined /> },

    // Address
    "address.region": { label: t('organizations.addUserForm.label.region'), icon: <TagOutlined /> },
    "address.district": { label: t('organizations.addUserForm.label.district'), icon: <TagOutlined /> },
    "address.address": { label: t('organizations.addUserForm.label.address'), icon: <TagOutlined /> },

    // Bank details
    "bankDetails.bankName": { label: t('organizations.addUserForm.label.bankName'), icon: <TagOutlined /> },
    "bankDetails.ccea": { label: t('organizations.addUserForm.label.ccea'), icon: <TagOutlined /> },
    "bankDetails.account": { label: t('organizations.addUserForm.label.account'), icon: <TagOutlined /> },
    "bankDetails.mfo": { label: t('organizations.addUserForm.label.mfo'), icon: <TagOutlined /> },

    // Contacts
    "contacts.phone": { label: t('organizations.addUserForm.label.phone'), icon: <PhoneOutlined style={{ color: "var(--status-success-color)" }} /> },
    "contacts.email": { label: t('organizations.addUserForm.label.email'), icon: <MailOutlined style={{ color: "var(--status-cyan-color)" }} /> },
    "contacts.url": { label: t('organizations.addUserForm.label.url'), icon: <GlobalOutlined /> },
    "contacts.person": { label: t('organizations.addUserForm.label.person'), icon: <UserOutlined /> },

    // Access codes
    "accessCodes.gcpCode": { label: t('organizations.addUserForm.label.gcpCode'), icon: <TagOutlined /> },
    "accessCodes.omsId": { label: t('organizations.addUserForm.label.omsId'), icon: <TagOutlined /> },
    "accessCodes.turonToken": { label: t('organizations.addUserForm.label.turonToken'), icon: <TagOutlined /> },
    // Product
    name: { label:  t('products.addProductForm.label.name'), icon: <TagOutlined /> },
    shortName: { label: t('products.addProductForm.label.shortName'), icon: <TagOutlined /> },
    description: { label: t('products.addProductForm.label.description'), icon: <TagOutlined /> },
    gtin: { label: t('products.addProductForm.label.gtin'), icon: <TagOutlined /> },
    barcode: { label: t('products.addProductForm.label.barcode'), icon: <TagOutlined /> },
    icps: { label: t('products.addProductForm.label.icps'), icon: <TagOutlined /> },
    productType: { label: t('products.addProductForm.label.productType'), icon: <TagOutlined /> },
    aggregationQuantity: { label: t('products.addProductForm.label.aggregationQuantity'), icon: <TagOutlined /> },
    expiration: { label: t('products.addProductForm.label.expiration'), icon: <ClockCircleOutlined /> },
    price: { label: t('products.addProductForm.label.price'), icon: <TagOutlined /> },
    companyId: { label:t('products.addProductForm.label.companyId'), icon: <ApartmentOutlined /> },
    "measurement.unit": { label:t('products.addProductForm.label.unit'), icon: <TagOutlined /> },
    "measurement.amount": { label: t('products.addProductForm.label.amount'), icon: <TagOutlined /> },

    // Weight
    "weight.net": { label: t('products.addProductForm.label.net'), icon: <TagOutlined /> },
    "weight.gross": { label: t('products.addProductForm.label.gross'), icon: <TagOutlined /> },
  };
};
