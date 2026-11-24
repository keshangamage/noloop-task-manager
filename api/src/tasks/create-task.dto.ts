import { IsString, Matches } from 'class-validator';
import { TaskFieldsDto } from './task-fields.dto.js';

export class CreateTaskDto extends TaskFieldsDto {
  @IsString()
  @Matches(/\S/, { message: 'title must not be blank' })
  title: string;
}
