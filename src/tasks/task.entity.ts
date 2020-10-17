import { User } from "../auth/user.entity";
import {
    BaseEntity, Column, CreateDateColumn, Entity,
    ManyToOne,
    PrimaryGeneratedColumn, Timestamp, UpdateDateColumn
} from "typeorm";

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    status: TaskStatus

    @CreateDateColumn()
    createdAt: Timestamp

    @UpdateDateColumn()
    updatedAt: Timestamp

    @ManyToOne(() => User, user => user.tasks)
    user: User

    @Column()
    userId: number
}

export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}