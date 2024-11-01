import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReservationService {
  private paymentServiceUrl: string;

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.paymentServiceUrl = `${this.configService.get<string>('MS3_URL')}/process-payment`;
  }

  async create(reservationData: Partial<Reservation>): Promise<Reservation> {
    const paymentPayload = {
      id: Date.now().toString(),
      amount: reservationData.total_amount,
      currency: 'USD',
      userId: reservationData.user.id,
      reservationId: reservationData.schedule.id,
    };

    const paymentResponse: any = await lastValueFrom(
      this.httpService.post(this.paymentServiceUrl, paymentPayload),
    );

    if (paymentResponse.data.status === 'failure') {
      throw new HttpException(
        'El pago ha fallado. No se pudo completar la reservación.',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const reservation = this.reservationRepository.create(reservationData);
    return await this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      relations: ['user', 'schedule'],
    });
  }

  async findById(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['user', 'schedule'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async update(
    id: number,
    updateData: Partial<Reservation>,
  ): Promise<Reservation> {
    await this.reservationRepository.update(id, updateData);
    const updatedReservation = await this.reservationRepository.findOne({
      where: { id },
    });
    if (!updatedReservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return updatedReservation;
  }

  async delete(id: number): Promise<void> {
    const deleteResult = await this.reservationRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
  }
}
