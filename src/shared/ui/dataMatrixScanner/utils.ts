import { GS1_GROUP_SEPARATOR } from './constants';

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const normalizeScannedCode = (rawValue: string) =>
  rawValue
    .replace(/^\]d2/i, '')
    .replace(/\\u001d/gi, GS1_GROUP_SEPARATOR)
    .replace(/\\x1d/gi, GS1_GROUP_SEPARATOR)
    .replace(/<gs>/gi, GS1_GROUP_SEPARATOR)
    .replace(/\[gs\]/gi, GS1_GROUP_SEPARATOR)
    .replace(/\u241d/g, GS1_GROUP_SEPARATOR)
    .replace(/\r?\n|\r/g, '')
    .trim();
