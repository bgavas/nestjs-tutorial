import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';

@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
	],
	imports: [
		PassportModule.register({
			defaultStrategy: 'jwt',
		}),
		JwtModule.register({
			secret: 'TOP_SECRET',
			signOptions: {
				expiresIn: 60 * 60, // in seconds
			}
		}),
		TypeOrmModule.forFeature([UserRepository]),
	],
	exports: [
		JwtStrategy,
		PassportModule,
	],
})

export class AuthModule {}
