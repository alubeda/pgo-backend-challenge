import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  ParseBoolPipe,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // GET /tasks
  @Get()
  async findAll(@Query(ValidationPipe) filterDto?: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.findAll(filterDto);
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

  // PATCH /tasks/:id
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.tasksService.update(id, updateTaskDto);

    if (!updatedTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return updatedTask;
  }
}
