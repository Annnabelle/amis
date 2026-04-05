export interface SalesOrdersTableDataType {
  key: string;
  orderNumber: string;
  customerName: string;
  customerTin: string;
  dueDate: string;
  priority: string;
  orderedQuantity: number | string;
  assignedQuantity: number | string;
  deliveredQuantity: number | string;
  status: string;
  createdAt: string;
}
