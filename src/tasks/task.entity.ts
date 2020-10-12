import {
    BaseEntity, Column, CreateDateColumn, Entity,
    PrimaryGeneratedColumn, UpdateDateColumn
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
    createdAt

    @UpdateDateColumn()
    updatedAt
}

export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}