import { IsString, Matches } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @Matches(/\S/, { message: 'title must not be blank' })
  title: string;
}
