import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;

  public constructor(
    @InjectRepository(User)
    userRepository: Repository<User>
  ) {
    this.userRepository = userRepository;
  }

  public getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public create(User: User): Promise<User> {
    return this.userRepository.save(User);
  }

  public getUser(id: string): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  public updateUser(User: User): Promise<User> {
    return this.userRepository.save(User);
  }

  public removeUser(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
