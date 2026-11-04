import type { ErrorDto } from "shared/types/dtos";
import type { OwnedCode, OwnedCodesSummary } from "entities/ownedCodes/types";

export type GetOwnedCodesDto = {
  page: number;
  limit: number;
  gtin?: string;
};

export type GetOwnedCodesResponseDto =
  | {
      success: true;
      page: number;
      limit: number;
      total: number;
      data: OwnedCode[];
    }
  | ErrorDto;

export type GetOwnedCodesSummaryResponseDto =
  | ({ success: true } & OwnedCodesSummary)
  | ErrorDto;

export const isOwnedCodesSummaryResponseSuccess = (
  response: GetOwnedCodesSummaryResponseDto
): response is Extract<GetOwnedCodesSummaryResponseDto, { success: true }> =>
  "success" in response && response.success === true && "products" in response;

export const isOwnedCodesResponseSuccess = (
  response: GetOwnedCodesResponseDto
): response is Extract<GetOwnedCodesResponseDto, { success: true }> =>
  "success" in response && response.success === true && "data" in response;
