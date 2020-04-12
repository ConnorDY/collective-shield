import { authorizationChecker } from './utils';

const normalUser: any = {
  firstName: 'Connor',
  lastName: 'Younglund',
  email: 'bahyounglund@gmail.com'
};

const adminUser: any = {
  ...normalUser,
  isSuperAdmin: true
};

const verifiedUser: any = {
  ...normalUser,
  isVerifiedMaker: true
};

describe('Utils', () => {
  describe('authorizationChecker', () => {
    it('should return false if user is undefined', () => {
      expect(authorizationChecker(undefined)).toEqual(false);
    });

    it('should return false if user is null', () => {
      expect(authorizationChecker(null)).toEqual(false);
    });

    it('should return true if the user is logged in and no roles are provided', () => {
      expect(authorizationChecker(normalUser)).toEqual(true);
    });

    it('should return false if the user is not an admin', () => {
      expect(authorizationChecker(normalUser, ['admin'])).toEqual(false);
    });

    it('should return true if the user is an admin', () => {
      expect(authorizationChecker(adminUser, ['admin'])).toEqual(true);
    });

    it('should return false if the user is not a verified maker', () => {
      expect(authorizationChecker(normalUser, ['verified'])).toEqual(false);
    });

    it('should return true if the user is a verified maker', () => {
      expect(authorizationChecker(verifiedUser, ['verified'])).toEqual(true);
    });

    it('should return false if the user is neither a verified maker or an admin', () => {
      expect(authorizationChecker(normalUser, ['verified', 'admin'])).toEqual(
        false
      );
    });

    it('should return true if the user is a verified maker or an admin', () => {
      const roles = ['verified', 'admin'];
      expect(authorizationChecker(verifiedUser, roles)).toEqual(true);
      expect(authorizationChecker(adminUser, roles)).toEqual(true);
    });
  });
});
