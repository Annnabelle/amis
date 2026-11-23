import type { SalesOrderFormValues } from "entities/salesOrders/mappers";

type OrderItem = NonNullable<SalesOrderFormValues["items"]>[number] | undefined;

/** Количество и цена приходят строками из поля ввода. */
const toBigInt = (value: unknown) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return 0n;

  try {
    return BigInt(digits);
  } catch {
    return 0n;
  }
};

/**
 * Сумма позиций считается целыми числами: произведение количества на цену
 * выходит за пределы точности number уже на крупном заказе.
 */
export const calculateItemsTotal = (items: OrderItem[] | undefined) => {
  const safeItems = Array.isArray(items) ? items : [];

  return safeItems.reduce((sum, item) => {
    const quantity = toBigInt(item?.quantity);
    const unitPrice = toBigInt(item?.unitPrice);

    return sum + quantity * unitPrice;
  }, 0n);
};

/** Стоимость доставки: цена за единицу расстояния на расстояние. */
export const calculateDeliveryCost = (
  costPerDistanceUnit: unknown,
  totalDistance: unknown,
) => {
  const cost = Number(costPerDistanceUnit);
  const distance = Number(totalDistance);

  if (!Number.isFinite(cost) || !Number.isFinite(distance)) return 0;

  return cost * distance;
};

export const formatAmount = (value: bigint | number) => new Intl.NumberFormat().format(value);

export const formatDeliveryCost = (value: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
