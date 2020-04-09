import { authorizationChecker } from './utils';

describe('Utils', () => {
  describe('authorizationChecker', () => {
    it('should return false if user is undefined', () => {
      expect(authorizationChecker(undefined)).toEqual(false);
    });

    it('should return false if user is null', () => {
      expect(authorizationChecker(null)).toEqual(false);
    });
  });
});
