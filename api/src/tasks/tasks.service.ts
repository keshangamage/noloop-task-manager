import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

export interface Task {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
}

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  create(title: string): Task {
    const task: Task = {
      id: randomUUID(),
      title: title.trim(),
      status: 'TODO',
      createdAt: new Date().toISOString(),
    };

    this.tasks.push(task);
    return task;
  }
}
