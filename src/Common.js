// @flow
export type Pickup = {
  id: number,
  name: ?string,
  price: ?number,
  tags: string[],
  itemIds: number[],
};

export type Item = {
  id: number,
  pickup_id: ?number,
  title: ?string,
  unit_price: ?number,
  quantity: ?number,
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
