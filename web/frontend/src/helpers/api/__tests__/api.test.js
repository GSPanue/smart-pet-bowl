import { getAPIURL } from '../api';

describe('API Helper', () => {
  describe('getAPIURL', () => {
    it('should return a string', () => {
      expect(getAPIURL()).toBeString();
    });
  });
});
