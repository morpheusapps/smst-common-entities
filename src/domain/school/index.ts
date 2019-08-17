import { Module, forwardRef, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './school.entity';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

@Module({
  imports: [
    forwardRef((): DynamicModule => TypeOrmModule.forFeature([School]))
  ],
  controllers: [SchoolController],
  providers: [SchoolService]
})
export class SchoolModule {}

export { School } from './school.entity';
export { FakeSchool } from './school.fake';
