import type { ReferenceDto } from "entities/references/dtos";
import type { Reference } from "entities/references/types";

export const mapReferenceDtoToReference = (
  dto: ReferenceDto
): Reference => ({
  alias: dto.alias,
  title: dto.title,
});





