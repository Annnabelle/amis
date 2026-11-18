import type { AccessCodesDto, AddressDto } from '@edem2000/amis.contracts/api/companies/requests';
import type { CompanyType } from '@edem2000/amis.contracts';
﻿

import type { UpdateCompanyDto } from '@edem2000/amis.contracts/api/companies/requests';


/**
 * Фактическая форма запроса.
 *
 * director, companyType, productGroup и accessCodes сервер отбрасывает.
 * В AddressDto обязательны regionId и districtId, которых форма не отправляет.
 */
export type UpdateCompanyRequestDto = Omit<UpdateCompanyDto, 'address'> & {
  address?: Partial<Pick<AddressDto, 'regionId' | 'districtId'>> &
    Omit<AddressDto, 'regionId' | 'districtId'>;
  director?: string;
  companyType?: CompanyType;
  productGroup?: string;
  accessCodes?: AccessCodesDto;
};
