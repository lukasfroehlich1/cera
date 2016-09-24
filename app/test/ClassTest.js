import { expect } from 'chai';
import { Coordinate, Time } from '../models/class_defs';


describe('Class Tests', () => {
  describe('#Time', () => {
    it('should have an equal value', () => {
      const hour_form = new Time(10, 12);
      const minute_form = new Time(612);

      expect(hour_form.getMinutes()).to.equal(minute_form.getMinutes());
    });
  });

  describe('#Coordinate', () => {
    it('should equal similar coordinate', () => {
      const val1 = new Coordinate(296, 403);
      const val2 = new Coordinate(296, 403);

      expect(val1.equals(val2));
      expect(val1.toString()).to.equal(val2.toString());
    });
    it('should not be equal different coordinate', () => {
      const val1 = new Coordinate(33, 124);
      const val2 = new Coordinate(493, 433);

      expect(!val1.equals(val2));
      expect(val1.toString()).to.not.equal(val2.toString());
    });
  });
});

