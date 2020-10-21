import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from "./jwt.strategy";
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const mockUserRepository = () => ({
    findOne: jest.fn(),
});

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy, {
                    provide: UserRepository,
                    useFactory: mockUserRepository
                }
            ]
        }).compile();

        jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('', () => {
        it('validate and returns the user based on JWT payload', async () => {
            const user = new User();
            user.username = 'testUser';

            userRepository.findOne.mockResolvedValue(user);

            const result = await jwtStrategy.validate({ username: user.username });

            expect(userRepository.findOne).toHaveBeenCalledWith({ username: user.username });
            expect(result).toEqual(user);
        });
        
        it('throws an unauthorized exception as user not found', async () => {
            const user = new User();
            user.username = 'testUser';

            await expect(jwtStrategy.validate({ username: user.username })).rejects
                .toThrow(new UnauthorizedException());
        });
    });
});