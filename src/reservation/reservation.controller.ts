import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.entity';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(
    @Body() reservationData: Partial<Reservation>,
  ): Promise<Reservation> {
    return await this.reservationService.create(reservationData);
  }

  @Get()
  async findAll(): Promise<Reservation[]> {
    return await this.reservationService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Reservation> {
    return await this.reservationService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Reservation>,
  ): Promise<Reservation> {
    return await this.reservationService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.reservationService.delete(id);
  }
}
