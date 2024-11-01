import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Field } from '../field/field.entity';
import { Reservation } from '../reservation/reservation.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'varchar', length: 45 })
  start_time: string;

  @Column({ type: 'varchar', length: 45 })
  end_time: string;

  @Column({ type: 'tinyint' })
  is_reserved: number;

  @ManyToOne(() => Field, (field) => field.schedules)
  field: Field;

  @OneToMany(() => Reservation, (reservation) => reservation.schedule)
  reservations: Reservation[];
}
