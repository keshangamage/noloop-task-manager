import { IsString, Matches, ValidateIf } from 'class-validator';
import { TaskFieldsDto } from './task-fields.dto.js';

export class UpdateTaskDto extends TaskFieldsDto {
  @ValidateIf((_task, value: unknown) => value !== undefined)
  @IsString()
  @Matches(/\S/, { message: 'title must not be blank' })
  title?: string;
}
