import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import type { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // GET /tasks
  @Get()
  async findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  // GET /tasks/:id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  // POST /tasks
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  // DELETE /tasks/:id
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    const deletedTask = await this.tasksService.remove(id);
    if (!deletedTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return deletedTask;
  }
}
