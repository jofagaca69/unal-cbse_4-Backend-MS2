import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from '../schedule/schedule.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  name: string;

  @Column({ length: 45 })
  location: string;

  @Column({ length: 45 })
  surface: string;

  @Column({ type: 'varchar', length: 45 })
  price_per_hour: string;

  @Column({ type: 'varchar', length: 45 })
  is_available: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Schedule, (schedule) => schedule.field)
  schedules: Schedule[];
}
