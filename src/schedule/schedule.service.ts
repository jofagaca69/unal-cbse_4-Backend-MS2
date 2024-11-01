import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(scheduleData: Partial<Schedule>): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(scheduleData);
    return await this.scheduleRepository.save(schedule);
  }

  async findAll(): Promise<Schedule[]> {
    return await this.scheduleRepository.find({
      relations: ['field', 'reservations'],
    });
  }

  async findById(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['field', 'reservations'],
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async update(id: number, updateData: Partial<Schedule>): Promise<Schedule> {
    await this.scheduleRepository.update(id, updateData);
    const updatedSchedule = await this.scheduleRepository.findOne({
      where: { id },
    });
    if (!updatedSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return updatedSchedule;
  }

  async delete(id: number): Promise<void> {
    const deleteResult = await this.scheduleRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
  }
}
