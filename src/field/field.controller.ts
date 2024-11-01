import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FieldService } from './field.service';
import { Field } from './field.entity';


@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Get(':id')
  async getField(@Param('id') id: number) {
    return await this.fieldService.getFieldById(id);
  }

  @Post()
  async createField(
    @Body()
    data: {
      name: string;
      location: string;
      surface: string;
      price_per_hour: string;
      is_available: string;
    },
  ): Promise<Field> {
    return await this.fieldService.createField(data);
  }
}
