import {deepStrictEqual as equal} from 'assert';
import {centsToDollars, intToBoolean} from '../src/Common.js';

describe('Common', () => {
  describe('centsToDollars', () => {
    it('works', () => {
      equal(centsToDollars(1000), 10);
      equal(centsToDollars(0), 0);
      equal(centsToDollars(1010), 10.1);
      equal(centsToDollars(null), null);
    });
  });
  describe('intToBoolean', () => {
    it('works', () => {
      equal(intToBoolean(0), false);
      equal(intToBoolean(1), true);
      equal(intToBoolean(2), null);
      equal(intToBoolean(null), null);
    });
  });
});
