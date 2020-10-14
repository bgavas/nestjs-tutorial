import {
    BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
    Timestamp, Unique
} from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    salt: string

    @CreateDateColumn()
    createdAt: Timestamp

    @CreateDateColumn()
    updatedAt: Timestamp

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}