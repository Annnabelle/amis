export interface SalesOrdersTableDataType {
  key: string;
  orderNumber: string;
  customerName: string;
  customerTin: string;
  dueDate: string;
  priority: string;
  priorityKey: string;
  orderedQuantity: number | string;
  deliveredQuantity: number | string;
  status: string;
}
