import type { ReferenceDto } from "../../dtos/references";
import type { Reference } from "../../types/references";

export const mapReferenceDtoToReference = (
  dto: ReferenceDto
): Reference => ({
  alias: dto.alias,
  title: dto.title,
});

