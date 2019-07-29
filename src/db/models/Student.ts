import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ObjectType,
  ManyToOne
} from 'typeorm';
import { School } from './School';
import { User } from './User';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public email: string;

  @ManyToOne(
    (): ObjectType<School> => School,
    (school: School): Student[] => school.students
  )
  public school: School;

  @ManyToOne(
    (): ObjectType<User> => User,
    (user: User): Student[] => user.students
  )
  public user: User;
}
