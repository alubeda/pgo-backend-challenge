import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    service = new TasksService();
  });

  describe('findAll', () => {
    it('should return all tasks if no filter is provided', async () => {
      const tasks = await service.findAll();
      expect(tasks).toHaveLength(2);
    });

    it('should return only done tasks when isDone = true', async () => {
      const filter: GetTasksFilterDto = { isDone: true };
      const result = await service.findAll(filter);
      expect(result.every((task) => task.isDone)).toBe(true);
    });

    it('should return only pending tasks when isDone = false', async () => {
      const filter: GetTasksFilterDto = { isDone: false };
      const result = await service.findAll(filter);
      expect(result.every((task) => !task.isDone)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return a task with the given id', async () => {
      const task = await service.findOne(1);
      expect(task?.id).toBe(1);
    });

    it('should return null if task is not found', async () => {
      const task = await service.findOne(200);
      expect(task).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new task', async () => {
      const dto: CreateTaskDto = {
        title: 'New Task',
        description: 'A new one',
      };

      const task = await service.create(dto);
      expect(task).toMatchObject({
        title: dto.title,
        description: dto.description,
        isDone: false,
      });

      const all = await service.findAll();
      expect(all).toHaveLength(3); // includes the newly added task
    });
  });

  describe('remove', () => {
    it('should remove and return the task if it exists', async () => {
      const removed = await service.remove(1);
      expect(removed?.id).toBe(1);

      const task = await service.findOne(1);
      expect(task).toBeNull();
    });

    it('should return null if task is not found', async () => {
      const result = await service.remove(200);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the task', async () => {
      const dto: UpdateTaskDto = { isDone: true };
      const updated = await service.update(1, dto);

      expect(updated).toBeDefined();
      expect(updated?.isDone).toBe(true);
    });

    it('should return null if task is not found', async () => {
      const result = await service.update(200, { title: 'Does not exist' });
      expect(result).toBeNull();
    });

    it('should update only provided fields', async () => {
      const dto: UpdateTaskDto = { title: 'Updated Title' };
      const updated = await service.update(2, dto);

      expect(updated?.title).toBe('Updated Title');
      expect(updated?.description).toBe('This is another task'); // unchanged
    });

    it('should persist the updated task', async () => {
      const dto: UpdateTaskDto = { title: 'Updated Title' };
      const updated = await service.update(2, dto);
      const task = await service.findOne(2);

      expect(task?.title).toBe('Updated Title');
    });
  });
});
