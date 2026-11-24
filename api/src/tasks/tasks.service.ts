import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateTaskDto } from './create-task.dto.js';
import type { Task } from './task.js';
import type { UpdateTaskDto } from './update-task.dto.js';

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  create({ title, description, status = 'TODO', dueDate }: CreateTaskDto): Task {
    const task: Task = {
      id: randomUUID(),
      title: title.trim(),
      description,
      status,
      dueDate,
      createdAt: new Date().toISOString(),
    };

    this.tasks.push(task);
    return task;
  }

  update(id: string, changes: UpdateTaskDto): Task {
    const task = this.findOne(id);
    if (changes.title !== undefined) {
      task.title = changes.title.trim();
    }
    if (changes.description !== undefined) {
      task.description = changes.description;
    }
    if (changes.status !== undefined) {
      task.status = changes.status;
    }
    if (changes.dueDate !== undefined) {
      task.dueDate = changes.dueDate;
    }
    return task;
  }

  remove(id: string): void {
    const task = this.findOne(id);
    this.tasks.splice(this.tasks.indexOf(task), 1);
  }
}
