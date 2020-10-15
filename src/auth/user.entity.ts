import {
    BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn,
    Timestamp, Unique
} from "typeorm";
import * as bcrypt from 'bcrypt';
import { Task } from "src/tasks/task.entity";

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
        return await bcrypt.compare(password, this.password);
    }
}