import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTasksFilterDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (['1', 'true'].includes(value)) {
      return true;
    }

    if (['0', 'false'].includes(value)) {
      return false;
    }

    return value;
  })
  isDone?: boolean;
}
