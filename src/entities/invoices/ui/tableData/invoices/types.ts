export interface InvoicesTableDataType {
  key: string;
  invoiceNumber: string;
  invoiceDate: string;
  senderName: string;
  receiverName: string;
  amountWithoutVat: number | string;
  itemsQuantity: number | string;
  unitsQuantity: number | string;
  externalStatus: string;
  status: string;
  createdAt: string;
}
