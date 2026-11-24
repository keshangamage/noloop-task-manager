import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto.js';
import { TasksService, type Task } from './tasks.service.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body() task: CreateTaskDto): Task {
    return this.tasksService.create(task.title);
  }
}
