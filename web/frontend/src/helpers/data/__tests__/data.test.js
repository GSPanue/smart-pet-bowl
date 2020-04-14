import { sortByDate } from '../data';

describe('Data Helper', () => {
  describe('sortByDate', () => {
    it('should return an array', () => {
      const arr = [{
        timestamp: new Date().getTime()
      }, {
        timestamp: new Date().getTime()
      }];

      expect(sortByDate(arr)).toBeArray();
    });

    it('should return an array of length two', () => {
      const arr = [{
        timestamp: new Date().getTime()
      }, {
        timestamp: new Date().getTime()
      }];

      expect(sortByDate(arr)).toBeArrayOfSize(2);
    });

    it('should sort an array by date', () => {
      const t1 = new Date().getTime();
      const t2 = new Date(Date.now() - 1000 * 60).getTime();

      const initialArr = [{
        weight: 10,
        timestamp: t1
      }, {
        weight: 20,
        timestamp: t2
      }];

      expect(sortByDate(initialArr)[0]).toEqual({
        weight: 20,
        timestamp: t2
      });
    });
  });
});
