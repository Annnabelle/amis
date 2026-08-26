export interface WaybillsTableDataType {
  key: string;
  waybillNumber: string;
  date: string;
  senderName: string;
  consigneeName: string;
  deliveryCost: string | number;
  externalStatus: string;
  status: string;
  createdAt: string;
}
