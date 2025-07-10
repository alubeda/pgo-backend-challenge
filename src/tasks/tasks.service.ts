import { Injectable } from '@nestjs/common';
import type { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  // emulate a database incrementing id sequence
  private idSequence: number = 2;

  private tasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'This is a task', isDone: false },
    { id: 2, title: 'Task 2', description: 'This is another task', isDone: true },
  ];

  async findAll(filterDto?: GetTasksFilterDto): Promise<Task[]> {
    if (typeof filterDto?.isDone === 'boolean') {
      return this.tasks.filter((task) => task.isDone === filterDto.isDone);
    }

    return this.tasks;
  }

  async findOne(id: number): Promise<Task | null> {
    return this.tasks.find((task) => task.id === id) || null;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task: Task = {
      id: ++this.idSequence,
      title: createTaskDto.title,
      description: createTaskDto.description || '',
      isDone: false,
    };

    this.tasks.push(task);

    return task;
  }

  async remove(id: number): Promise<Task | null> {
    const taskIndex: number = this.tasks.findIndex((task) => task.id === id);

    return taskIndex === -1 ? null : this.tasks.splice(taskIndex, 1)[0];
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const task = this.tasks.find((task) => task.id === id) || null;
    if (!task) {
      return null;
    }

    for (const property in updateTaskDto) {
      if (typeof updateTaskDto[property] !== 'undefined') {
        task[property] = updateTaskDto[property];
      }
    }

    return task;
  }
}
