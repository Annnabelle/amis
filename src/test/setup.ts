import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/** Каждый тест начинает с пустого документа. */
afterEach(() => {
  cleanup();
});
