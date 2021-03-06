import {
    BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn,
    Timestamp, Unique
} from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Task } from "../tasks/task.entity";

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

    @OneToMany(() => Task, task => task.user)
    tasks: Task[]

    async validatePassword(password: string): Promise<boolean> {
        const result = await bcrypt.compare(password, this.password);
        return !!result;
    }
}