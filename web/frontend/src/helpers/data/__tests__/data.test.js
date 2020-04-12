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
  });
});
