import { describe, expect, it } from "vitest";

import { applyDateLocale, formatDate, formatDateTime, formatDateTimeSeconds } from "shared/lib/formatDate";
import { normalizeLanguage } from "shared/lib/language";

describe("normalizeLanguage", () => {
  it("срезает регион", () => {
    expect(normalizeLanguage("ru-RU")).toBe("ru");
    expect(normalizeLanguage("en-US")).toBe("en");
    expect(normalizeLanguage("uz-Latn-UZ")).toBe("uz");
  });

  it("незнакомый язык откатывается на русский", () => {
    expect(normalizeLanguage("de")).toBe("ru");
    expect(normalizeLanguage(undefined)).toBe("ru");
    expect(normalizeLanguage("")).toBe("ru");
  });
});

describe("formatDate", () => {
  const moment = "2026-11-21T07:08:09.000Z";

  it("дата, дата со временем и дата с секундами", () => {
    applyDateLocale("ru");
    expect(formatDate("2026-11-21T00:00:00.000Z")).toMatch(/^\d{2}\.\d{2}\.2026$/);
    expect(formatDateTime(moment)).toMatch(/^\d{2}\.\d{2}\.2026 \d{2}:\d{2}$/);
    expect(formatDateTimeSeconds(moment)).toMatch(/^\d{2}\.\d{2}\.2026 \d{2}:\d{2}:\d{2}$/);
  });

  it("пустое и битое значение отдают заглушку", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    expect(formatDate("")).toBe("-");
    expect(formatDate("не дата")).toBe("-");
    expect(formatDate(null, "—")).toBe("—");
  });
});
