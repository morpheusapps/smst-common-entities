import { Module, forwardRef, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef((): DynamicModule => TypeOrmModule.forFeature([User]))],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

export { User } from './user.entity';
export { FakeUser } from './user.fake';
