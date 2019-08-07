import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './domain/health';
import { StudentModule } from './domain/student';
import { GlobalErrorHandlerModule } from './domain/error';
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    HealthModule,
    StudentModule,
    GlobalErrorHandlerModule
  ]
})
export class ApplicationModule {}
