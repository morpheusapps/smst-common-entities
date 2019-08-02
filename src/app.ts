import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './domain/health';
import { StudentModule } from './domain/student';

@Module({
  imports: [TypeOrmModule.forRoot(), HealthModule, StudentModule]
})
export class ApplicationModule {}
