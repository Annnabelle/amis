export type HexString = string;

export const Language = {
  Russian: 'ru',
  English: 'en',
  Uzbek: 'uz',
} as const;

export const AllLanguages = Object.values(Language);

export const isLanguage = (value: string): value is Language =>
  (AllLanguages as string[]).includes(value);

export type Language = (typeof Language)[keyof typeof Language];

export type MultiLanguage = Record<Language, string>;

export type ErrorDto = {
  success: boolean,
  errorMessage: MultiLanguage,
  errorCode: number,
}