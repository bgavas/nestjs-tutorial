import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();

        const user = this.create();
        user.username = username;
        user.salt = salt;
        user.password = await this.hashPassword(password, salt);

        try {
            await user.save();
        } catch (error) {
            // Duplicate username
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            }
            throw new InternalServerErrorException();
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;

        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username;
        }

        return null;
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}