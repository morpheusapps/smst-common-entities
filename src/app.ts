import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalErrorHandlerModule } from './domain/error';
import { HealthModule } from './domain/health';
import { StudentModule } from './domain/student';
import { UserModule } from './domain/user';
import { SchoolModule } from './domain/school';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GlobalErrorHandlerModule,
    HealthModule,
    StudentModule,
    UserModule,
    SchoolModule
  ]
})
export class ApplicationModule {}
