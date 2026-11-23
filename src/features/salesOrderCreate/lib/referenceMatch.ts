import type { Reference } from "entities/references/types";
import type { LanguageKey } from "shared/lib/utils";

/**
 * Сопоставление адреса из карты и из карточки компании со справочниками.
 *
 * Названия приходят в разном виде: «Ташкентская область», «Toshkent viloyati»,
 * «г. Ташкент». Поэтому сравниваются не строки, а их очищенные варианты —
 * без типов территорий, без ё и без разделителей.
 */
export const getReferenceValue = (reference: Reference) =>
  reference.id ?? reference.alias;

export const getReferenceLabel = (reference: Reference, language: LanguageKey) =>
  reference.title[language] || reference.title.ru || reference.alias;

export const getReferenceByValue = (items: Reference[], value?: string) =>
  items.find((item) => getReferenceValue(item) === value);

export const normalizeReferenceText = (value?: string) =>
  value
    ?.toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,'`"_/-]/g, " ")
    .replace(
      /(^|\s)(республика|область|обл|район|р-н|р н|город|г|shahar|shahri|city|viloyati|tumani|вилояти|тумани)(?=\s|$)/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();

export const getReferenceTextVariants = (value?: string) => {
  const normalized = normalizeReferenceText(value);
  if (!normalized) return [];

  const stemmed = normalized.replace(/\b([а-я]+?)(ский|ской|цкий|кий|ый|ий)\b/g, "$1");

  return [normalized, stemmed].filter(
    (item, index, items) => item && items.indexOf(item) === index,
  );
};

const getReferenceTitleValues = (title: Reference["title"] | string | undefined) => {
  if (!title) return [];
  if (typeof title === "string") return [title];

  return Object.values(title).filter((value): value is string => typeof value === "string");
};

const getReferenceRawSearchValues = (reference: Reference) =>
  [reference.id, reference.alias, ...getReferenceTitleValues(reference.title)].filter(
    (value): value is string => Boolean(value),
  );

export const getReferenceSearchValues = (reference: Reference) =>
  getReferenceRawSearchValues(reference)
    .flatMap(getReferenceTextVariants)
    .filter(
      (value, index, values): value is string =>
        Boolean(value) && values.indexOf(value) === index,
    );

export const getReferenceDebugInfo = (reference: Reference) => ({
  value: getReferenceValue(reference),
  alias: reference.alias,
  title: reference.title,
  searchValues: getReferenceSearchValues(reference),
});

/** Точное совпадение важнее частичного: иначе «Ташкент» берёт область вместо города. */
export const resolveReferenceByCandidates = (
  items: Reference[],
  candidates: string[],
) => {
  const normalizedCandidates = candidates
    .flatMap(getReferenceTextVariants)
    .filter(
      (value, index, values): value is string =>
        Boolean(value) && values.indexOf(value) === index,
    );

  if (normalizedCandidates.length === 0) return undefined;

  const exactMatch = normalizedCandidates
    .map((candidate) => items.find((item) => getReferenceSearchValues(item).includes(candidate)))
    .find(Boolean);

  if (exactMatch) return exactMatch;

  const rawCandidates = candidates.map((candidate) => candidate.trim()).filter(Boolean);

  const rawExactMatch = rawCandidates
    .map((candidate) =>
      items.find((item) =>
        getReferenceRawSearchValues(item)
          .map((value) => value.trim())
          .includes(candidate),
      ),
    )
    .find(Boolean);

  if (rawExactMatch) return rawExactMatch;

  return normalizedCandidates
    .map((candidate) =>
      items.find((item) =>
        getReferenceSearchValues(item).some(
          (value) =>
            (value.length > 3 && candidate.includes(value)) ||
            (candidate.length > 3 && value.includes(candidate)),
        ),
      ),
    )
    .find(Boolean);
};

/** Значение справочника по названию из карточки компании. */
export const resolveReferenceValue = (items: Reference[], value?: string) => {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return undefined;

  const found = items.find((item) => {
    const candidates = [item.id, item.alias, item.title.ru, item.title.en, item.title.uz];

    return candidates.some((candidate) => candidate?.trim().toLowerCase() === normalized);
  });

  return found ? getReferenceValue(found) : undefined;
};

/** Строка для геокодера: страна, область, район, улица. */
export const buildGeocodeAddress = ({
  address,
  regionId,
  districtId,
  regions,
  districts = [],
  language,
}: {
  address?: string;
  regionId?: string;
  districtId?: string;
  regions: Reference[];
  districts?: Reference[];
  language: LanguageKey;
}) => {
  const region = getReferenceByValue(regions, regionId);
  const district = getReferenceByValue(districts, districtId);
  const parts = [
    "Узбекистан",
    region ? getReferenceLabel(region, language) : undefined,
    district ? getReferenceLabel(district, language) : undefined,
    address?.trim(),
  ].filter(Boolean);

  return parts.join(", ");
};
