import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FieldModule } from './field/field.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './field/field.entity';
import { User } from './user/user.entity';
import { Schedule } from './schedule/schedule.entity';
import { Reservation } from './reservation/reservation.entity';
import { ReservationModule } from './reservation/reservation.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: false,
        synchronize: false,
        entities: [Field, User, Schedule, Reservation],
      }),
    }),
    FieldModule,
    ReservationModule,
    ScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private configService: ConfigService) {} // Inyecta ConfigService

  onModuleInit() {
    const databaseHost = this.configService.get<string>('DATABASE_HOST');
    console.log(`Database Host: ${databaseHost}`); // Muestra el valor en consola
  }
}
