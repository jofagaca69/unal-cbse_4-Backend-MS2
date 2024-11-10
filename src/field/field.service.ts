import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from './field.entity';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  async getFieldById(id: number): Promise<Field> {
    const field = await this.fieldRepository.findOneBy({ id });
    if (!field) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }
    return field;
  }

  async createField(data: {
    name: string;
    location: string;
    surface: string;
    price_per_hour: string;
    is_available: string;
    created_at?: Date;
    updated_at?: Date;
  }): Promise<Field> {
    data.created_at = new Date();
    data.updated_at = new Date();
    const newField = this.fieldRepository.create(data);
    return await this.fieldRepository.save(newField);
  }

  async getAllFields() {
    const fields = this.fieldRepository.find();
    if (!fields) {
      throw new NotFoundException(`No fields found`);
    }
    return fields;
  }

  async deleteFieldById(id: number): Promise<void> {
    const field = await this.fieldRepository.findOneBy({ id });

    if (!field) {
      throw new NotFoundException(`Field with ID ${id} not found`);
    }

    await this.fieldRepository.delete(id);
  }
}
