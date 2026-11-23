import { describe, expect, it } from "vitest";

import {
  AggregatedCustomsCodeOrderStatus,
  type CustomsCodeOrder,
} from "entities/customsCodes/types";
import {
  canInitiateDissolution,
  canResume,
  canSignDissolution,
  canSignRegistration,
  getDocumentForSigning,
} from "features/customsCodeSign/lib/orderActions";

const order = (
  status: CustomsCodeOrder["status"],
  documents: { registration?: string; dissolution?: string } = {},
) =>
  ({
    id: "acc-1",
    status,
    external: {
      registration: { documentBase64: documents.registration },
      dissolution: { documentBase64: documents.dissolution },
    },
  }) as unknown as CustomsCodeOrder;

describe("действия над заказом ТН ВЭД", () => {
  it("подписать регистрацию можно до и после подписи", () => {
    expect(canSignRegistration(order(AggregatedCustomsCodeOrderStatus.ReadyForSign))).toBe(true);
    expect(
      canSignRegistration(order(AggregatedCustomsCodeOrderStatus.SignedForRegistration)),
    ).toBe(true);
    expect(canSignRegistration(order(AggregatedCustomsCodeOrderStatus.Registered))).toBe(false);
  });

  it("снять код можно с зарегистрированного и после отказа в снятии", () => {
    expect(canInitiateDissolution(order(AggregatedCustomsCodeOrderStatus.Registered))).toBe(true);
    expect(
      canInitiateDissolution(order(AggregatedCustomsCodeOrderStatus.DissolutionFailed)),
    ).toBe(true);
    expect(canInitiateDissolution(order(AggregatedCustomsCodeOrderStatus.ReadyForSign))).toBe(
      false,
    );
  });

  it("повтор предлагается только после отказа регистрации", () => {
    expect(canResume(order(AggregatedCustomsCodeOrderStatus.RegistrationFailed))).toBe(true);
    expect(canResume(order(AggregatedCustomsCodeOrderStatus.Registered))).toBe(false);
  });

  it("подписать снятие можно после его начала", () => {
    expect(
      canSignDissolution(order(AggregatedCustomsCodeOrderStatus.DissolutionInitialized)),
    ).toBe(true);
    expect(canSignDissolution(order(AggregatedCustomsCodeOrderStatus.SignedForDissolution))).toBe(
      true,
    );
    expect(canSignDissolution(order(AggregatedCustomsCodeOrderStatus.Registered))).toBe(false);
  });

  it("документ берётся из своей ветки заказа", () => {
    const target = order(AggregatedCustomsCodeOrderStatus.ReadyForSign, {
      registration: "cmVn",
      dissolution: "ZGlz",
    });

    expect(getDocumentForSigning(target, "registration")).toBe("cmVn");
    expect(getDocumentForSigning(target, "dissolution")).toBe("ZGlz");
    expect(
      getDocumentForSigning(order(AggregatedCustomsCodeOrderStatus.ReadyForSign), "registration"),
    ).toBeUndefined();
  });
});
