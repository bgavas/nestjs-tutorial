import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

describe('User Entity', () => {
    let user;

    beforeEach(() => {
        user = new User();
        user.salt = 'testSalt';
        user.password = 'testHashedPassword';
        bcrypt.compare = jest.fn();
    });

    describe('validatePassword', () => {
        it('returns true as password is valid', async () => {
            bcrypt.compare.mockResolvedValue(true);

            expect(bcrypt.compare).not.toHaveBeenCalled();

            const result = await user.validatePassword('123456');

            expect(bcrypt.compare).toHaveBeenCalledWith('123456', user.password);
            expect(result).toEqual(true);
        });

        it('returns false as password is invalid', async () => {
            bcrypt.compare.mockResolvedValue(false);

            expect(bcrypt.compare).not.toHaveBeenCalled();

            const result = await user.validatePassword('123456');

            expect(bcrypt.compare).toHaveBeenCalledWith('123456', user.password);
            expect(result).toEqual(false);
        });
    });
});