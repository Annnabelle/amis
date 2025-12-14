import { type TableProps } from 'antd';
import CustomButton from '../../components/button';
import type { TFunction } from 'i18next';
import type { MarkingCodesTableDataType } from './types';
import { Link } from 'react-router-dom';
import type { MarkingCodeTableDataType } from '../markingCodes/types';

export const MarkingCodeTableColumns = (t: TFunction, handleRowClick: (type: "MarkingCode", action: "retrieve" | "edit" | "delete", record: MarkingCodeTableDataType) => void) : TableProps<MarkingCodeTableDataType>["columns"] => [
  { 
    title: '№',
    dataIndex: "key",
    key: "key",
    render: (text) => <Link to="/marking-codes/1" className="table-text">{text}</Link>,
  },
  {
    title: t("markingCodes.markingCode.product"),
    dataIndex: "name",
    key: "name",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t("markingCodes.markingCode.mCQuantity"),
    dataIndex: "quantity",
    key: "quantity",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.markingCode.partyIDTuron"),
    dataIndex: "partyIDTuron",
    key: "partyIDTuron",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t("markingCodes.markingCode.creationDate"),
    dataIndex: "creationDate",
    key: "creationDate",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("markingCodes.markingCode.messageFromTuron"),
    dataIndex: "messageFromTuron",
    key: "messageFromTuron",
    render: (text) => <p className="table-text">{text}</p>,
  },
   {
    title: '',
    key: "action",
    render: (_, record) => (
      <CustomButton
        type="button"
        className="outline"
        onClick={(e) =>  {e.stopPropagation(); handleRowClick("MarkingCode", "edit", record);}}
      >
        {t("btn.sendToTuron")}
      </CustomButton>
    ),
  },
];
