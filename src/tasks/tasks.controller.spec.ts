import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from "./tasks.controller";
import { TasksService } from './tasks.service';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import type { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: jest.Mocked<TasksService>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Task for unit testing',
    isDone: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get(TasksService);
  });

  describe('findAll', () => {
    let result;
    const filters: GetTasksFilterDto = { isDone: true };

    beforeEach(async () => {
      service.findAll.mockResolvedValue([mockTask]);

      result = await controller.findAll(filters);
    });

    it('should return all tasks', () => {
      expect(result).toEqual([mockTask]);
    });

    it('should call service.findAll once', () => {
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call service.findAll with filters', () => {
      expect(service.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    describe('when the task exists', () => {
      let result;

      beforeEach(async () => {
        service.findOne.mockResolvedValue(mockTask);

        result = await controller.findOne(1);
      });

      it('should call service.findOne once', () => {
        expect(service.findOne).toHaveBeenCalledTimes(1);
      });

      it('should call service.findOne with the correct ID', () => {
        expect(service.findOne).toHaveBeenCalledWith(1);
      });

      it('should return a task by ID', async () => {
        expect(result).toEqual(mockTask);
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      await expect(controller.findOne(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    let result;

    beforeEach(async () => {
      service.create.mockResolvedValue(mockTask);

      const dto: CreateTaskDto = { title: 'New Task', description: 'Do stuff' };
      result = await controller.create(dto);
    });

    it('should call service.create once', () => {
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should call service.create with the correct data', () => {
      expect(service.create).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Do stuff',
      });
    });

    it('should return the created task', () => {
      expect(result).toEqual(mockTask);
    });
  });

  describe('remove', () => {
    describe('when the task exists', () => {
      let result;

      beforeEach(async () => {
        service.remove.mockResolvedValue(mockTask);

        result = await controller.remove(1);
      });

      it('should call service.remove once', () => {
        expect(service.remove).toHaveBeenCalledTimes(1);
      });

      it('should call service.remove with the correct ID', () => {
        expect(service.remove).toHaveBeenCalledWith(1);
      });

      it('should return the removed task', () => {
        expect(result).toEqual(mockTask);
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      service.remove.mockResolvedValue(null);

      await expect(controller.remove(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const dto: UpdateTaskDto = { isDone: true };

    describe('when the task exists', () => {
      let result;

      beforeEach(async () => {
        service.update.mockResolvedValue(mockTask);

        result = await controller.update(1, dto);
      });

      it('should call service.update once', () => {
        expect(service.update).toHaveBeenCalledTimes(1);
      });

      it('should call service.update with the correct ID', () => {
        expect(service.update).toHaveBeenCalledWith(1, { isDone: true });
      });

      it('should return the updated task', () => {
        expect(result).toEqual(mockTask);
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      service.update.mockResolvedValue(null);

      await expect(controller.update(2, dto)).rejects.toThrow(NotFoundException);
    });
  });
});
