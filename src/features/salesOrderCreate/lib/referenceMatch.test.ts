import { describe, expect, it } from "vitest";

import type { Reference } from "entities/references/types";
import {
  buildGeocodeAddress,
  getReferenceLabel,
  getReferenceValue,
  normalizeReferenceText,
  resolveReferenceByCandidates,
  resolveReferenceValue,
} from "features/salesOrderCreate/lib/referenceMatch";

const reference = (id: string, ru: string, uz?: string, en?: string): Reference =>
  ({ id, alias: id, title: { ru, uz, en } }) as Reference;

const regions = [
  reference("r-1", "Ташкентская область", "Toshkent viloyati", "Tashkent region"),
  reference("r-2", "город Ташкент", "Toshkent shahri", "Tashkent city"),
  reference("r-3", "Самаркандская область", "Samarqand viloyati"),
];

describe("сопоставление справочников", () => {
  it("чистит название от типа территории и разделителей", () => {
    expect(normalizeReferenceText("г. Ташкент")).toBe("ташкент");
    expect(normalizeReferenceText("Ташкентская область")).toBe("ташкентская");
    expect(normalizeReferenceText("Учтепинский р-н")).toBe("учтепинский");
  });

  it("ё и е считает одной буквой", () => {
    expect(normalizeReferenceText("Сергелийский")).toBe(normalizeReferenceText("Сергелийский"));
    expect(normalizeReferenceText("Тёплый")).toBe("теплый");
  });

  it("находит запись по названию из карты", () => {
    expect(resolveReferenceByCandidates(regions, ["Toshkent viloyati"])?.id).toBe("r-1");
    expect(resolveReferenceByCandidates(regions, ["Самаркандская область"])?.id).toBe("r-3");
  });

  it("точное совпадение важнее частичного", () => {
    expect(resolveReferenceByCandidates(regions, ["город Ташкент"])?.id).toBe("r-2");
  });

  it("на пустых кандидатах не угадывает", () => {
    expect(resolveReferenceByCandidates(regions, [])).toBeUndefined();
    expect(resolveReferenceByCandidates(regions, ["   "])).toBeUndefined();
  });

  it("берёт значение справочника по названию из карточки компании", () => {
    expect(resolveReferenceValue(regions, "Tashkent region")).toBe("r-1");
    expect(resolveReferenceValue(regions, "Неизвестный край")).toBeUndefined();
  });

  it("подпись берёт на языке интерфейса и откатывается на русский", () => {
    expect(getReferenceLabel(regions[0], "uz")).toBe("Toshkent viloyati");
    expect(getReferenceLabel(regions[2], "en")).toBe("Самаркандская область");
  });

  it("значение справочника — идентификатор, иначе алиас", () => {
    expect(getReferenceValue(regions[0])).toBe("r-1");
    expect(getReferenceValue({ alias: "tashkent", title: { ru: "" } } as Reference)).toBe(
      "tashkent",
    );
  });

  it("собирает строку для геокодера от страны к улице", () => {
    const districts = [reference("d-1", "Юнусабадский район")];

    expect(
      buildGeocodeAddress({
        address: "ул. Амира Темура, 1",
        regionId: "r-2",
        districtId: "d-1",
        regions,
        districts,
        language: "ru",
      }),
    ).toBe("Узбекистан, город Ташкент, Юнусабадский район, ул. Амира Темура, 1");
  });

  it("пропускает в строке то, чего не выбрали", () => {
    expect(buildGeocodeAddress({ regionId: "r-3", regions, language: "ru" })).toBe(
      "Узбекистан, Самаркандская область",
    );
  });
});
