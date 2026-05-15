export interface InvoiceItemsTableDataType {
  key: string;
  productName: string;
  quantity: number | string;
  measurementUnit: string;
  unitPrice: number | string;
  amountWithoutVat: number | string;
  taxes: string;
  psicCode: string;
  psicName: string;
  reliefId: string;
}
