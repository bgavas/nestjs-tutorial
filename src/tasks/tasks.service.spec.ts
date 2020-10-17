import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

const mockUser = {
    id: 1,
    username: 'testuser'
};

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService, {
                    provide: TaskRepository,
                    useFactory: mockTaskRepository
                }
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();

            const filter: GetTasksFilterDto = {
                status: TaskStatus.IN_PROGRESS,
                search: 'query',
            }
            const result = await tasksService.getTasks(filter, mockUser);

            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('call taskRepository.findOne() and successfully retrieve and return the task', async () => {
            const mockTask = { id: 1, title: 'Test Title', description: 'Test description' };
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(mockTask.id, mockUser);
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: mockTask.id,
                    userId: mockUser.id
                }
            });
            expect(result).toEqual(mockTask);
        });

        it('fails as task is not found', async () => {
            const mockTask = { id: 1, title: 'Test Title', description: 'Test description' };
            taskRepository.findOne.mockResolvedValue(null);
            
            expect(tasksService.getTaskById(mockTask.id, mockUser)).rejects
                .toThrow(new NotFoundException(`Task with id ${mockTask.id} not found`));
        });
    });

    describe('createTask', () => {
        it('creates a task', async () => {
            taskRepository.createTask.mockResolvedValue('someTask');

            const createTaskDto: CreateTaskDto = {
                title: 'Test Title',
                description: 'Test description',
            }
            const result = await tasksService.createTask(createTaskDto, mockUser);

            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
            expect(result).toEqual('someTask');
        });
    });

    describe('deleteTask', () => {
        it('delete a task', async () => {
            const mockTask = { id: 1, title: 'Test Title', description: 'Test description' };

            const remove = jest.fn().mockResolvedValue(true);

            tasksService.getTaskById = jest.fn().mockResolvedValue({
                remove,
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(remove).not.toHaveBeenCalled();

            const result = await tasksService.deleteTask(mockTask.id, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalledWith(mockTask.id, mockUser);
            expect(remove).toHaveBeenCalledWith();

            expect(result).toBe(undefined);
        });

        it('fails as task is not found', async () => {
            tasksService.getTaskById = jest.fn().mockResolvedValue(null);
            const mockTask = { id: 1, title: 'Test Title', description: 'Test description' };
            
            expect(tasksService.deleteTask(mockTask.id, mockUser)).rejects
                .toThrow(new NotFoundException(`Task with id ${mockTask.id} not found`));
        });
    });

    describe('updateTaskStatus', () => {
        it('updates a task status', async () => {
            const mockTask = { id: 1, title: 'Test Title', description: 'Test description' };

            const save = jest.fn().mockResolvedValue(true);

            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();

            const result = await tasksService.updateTaskStatus(mockTask.id, TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalledWith(mockTask.id, mockUser);
            expect(save).toHaveBeenCalledWith();

            expect(result.status).toEqual(TaskStatus.DONE);
        });

        it('fails as task is not found', async () => {
            tasksService.getTaskById = jest.fn().mockResolvedValue(null);
            const mockTask = { id: 1, title: 'Test Title', description: 'Test description' };
            
            expect(tasksService.updateTaskStatus(mockTask.id, TaskStatus.DONE, mockUser)).rejects
                .toThrow(new NotFoundException(`Task with id ${mockTask.id} not found`));
        });
    });
});