import type { DistrictReferenceDto, ReferenceDto, RegionReferenceDto } from '@edem2000/amis.contracts/api/reference-book/responses';
import type { Reference } from "entities/references/types";

export const mapReferenceDtoToReference = (
  dto: ReferenceDto
): Reference => ({
  alias: dto.alias,
  title: dto.title,
});

export const mapAddressReferenceDtoToReference = (
  dto: RegionReferenceDto | DistrictReferenceDto
): Reference => ({
  id: dto.id,
  alias: dto.alias,
  title: dto.title,
});


