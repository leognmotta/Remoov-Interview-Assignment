// @flow
export type Pickup = {
  id: number,
  name: ?string,
  price: ?number,
  formatted_price: ?string,
  tags: string[],
  itemIds: number[],
  balance_due: ?number,
  formatted_balance_due: ?string,
};

export type Item = {
  id: number,
  pickup_id: ?number,
  title: ?string,
  unit_price: ?number,
  unit_price_in_cents: number,
  formatted_unit_price: ?string,
  quantity: number,
  sold: ?boolean,
};

export function centsToDollars(cents: ?number): ?number {
  return cents || cents === 0 ? cents / 100 : null;
}

export function intToBoolean(int: ?number): ?boolean {
  if (int === 0) return false;
  if (int === 1) return true;
  return null;
}

export function getBalanceDue(items: Item[], pickupPrice: number): ?number {
  if (!items || !pickupPrice) return null;

  return items.reduce((pickupPrice: number, item: Item) => {
    return pickupPrice - item.unit_price_in_cents * item.quantity;
  }, pickupPrice);
}

export function formatNumberToDollar(value: ?number): ?string {
  if (typeof value !== 'number' || !value) return null;

  const {format: formatPrice} = new global.Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatPrice(value);
}
