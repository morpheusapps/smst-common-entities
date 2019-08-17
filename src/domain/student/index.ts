import { Module, forwardRef, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [
    forwardRef((): DynamicModule => TypeOrmModule.forFeature([Student]))
  ],
  controllers: [StudentController],
  providers: [StudentService]
})
export class StudentModule {}

export { Student } from './student.entity';
export { FakeStudent } from './student.fake';
