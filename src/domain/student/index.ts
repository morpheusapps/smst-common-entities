import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Student } from './student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentErrorService } from './studentError.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentController],
  providers: [
    StudentService,
    {
      provide: APP_INTERCEPTOR,
      useClass: StudentErrorService
    }
  ]
})
export class StudentModule {}

export { Student } from './student.entity';
