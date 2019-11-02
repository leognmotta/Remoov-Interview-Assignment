import {deepStrictEqual as equal} from 'assert';
import {
  centsToDollars,
  intToBoolean,
  getBalanceDue,
  formatNumberToDollar,
} from '../src/Common.js';
import Item from './factory';

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
  describe('getBalanceDue', () => {
    it('works', () => {
      const chair = new Item(50, 4);
      const table = new Item(100, 1);
      const sofa = new Item(100, 2);
      const lamp = new Item(10, 3);

      equal(getBalanceDue(), null);
      equal(getBalanceDue([chair, table], 100), -200);
      equal(getBalanceDue([sofa, lamp], 200), -30);
    });
  });
  describe('formatNumberToDollar', () => {
    it('works', () => {
      equal(formatNumberToDollar(1), '$1.00');
      equal(formatNumberToDollar(100), '$100.00');
      equal(formatNumberToDollar(10.2), '$10.20');
      equal(formatNumberToDollar('sada'), null);
      equal(formatNumberToDollar(), null);
    });
  });
});
