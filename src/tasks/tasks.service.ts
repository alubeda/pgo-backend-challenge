import { Injectable } from '@nestjs/common';

export interface Task {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
}

@Injectable()
export class TasksService {
  // emulate a database incrementing id sequence
  private idSequence: number = 2;

  private tasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'This is a task', isDone: false },
    { id: 2, title: 'Task 2', description: 'This is another task', isDone: true },
  ];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task | null {
    return this.tasks.find((task) => task.id === id) || null;
  }

  // TODO: Use an actual DTO
  create(createTaskDto: any): Task {
    const task: Task = {
      id: ++this.idSequence,
      title: createTaskDto.title,
      description: createTaskDto.description,
      isDone: false,
    };

    this.tasks.push(task);

    return task;
  }

  remove(id: number): Task | null {
    const taskIndex: number = this.tasks.findIndex((task) => task.id === id);

    return taskIndex === -1 ? null : this.tasks.splice(taskIndex, 1)[0];
  }
}
