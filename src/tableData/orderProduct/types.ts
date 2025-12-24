import type {MarkingCodeStatus} from "../../dtos";

export interface OrderProductDataType {
    key: string,
    code: string;
    status: MarkingCodeStatus;
}