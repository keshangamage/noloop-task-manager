import {
  IsIn,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { TASK_STATUSES, type TaskStatus } from './task.js';

export class TaskFieldsDto {
  @IsOptional()
  @IsString()
  description?: string | null;

  @ValidateIf((_task, value: unknown) => value !== undefined)
  @IsIn(TASK_STATUSES)
  status?: TaskStatus;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}(?:T|$)/, {
    message: 'dueDate must include a full calendar date',
  })
  @IsISO8601({ strict: true })
  dueDate?: string | null;
}
