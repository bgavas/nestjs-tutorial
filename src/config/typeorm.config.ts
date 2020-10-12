import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgreuser',
    password: '12345678',
    database: 'elkom_test',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
}