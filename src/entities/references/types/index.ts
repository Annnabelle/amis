import { ReferenceBookType } from '@edem2000/amis.contracts';
import type { GetReferenceDto } from '@edem2000/amis.contracts/api/reference/requests';
import type { Identifier, MultiLanguage } from "shared/types/dtos";

export { ReferenceBookType };
export type { GetReferenceDto };

export interface BaseModel {
  id?: Identifier;
}

export interface ReferenceBookModel extends BaseModel {
  alias: string;
  transcript: string;
  title: MultiLanguage;
}


export type Reference = {
    id?: string;
    alias: string;
    title: MultiLanguage
};

export type ReferenceList = {
    references: Reference[],
}


