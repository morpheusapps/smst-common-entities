import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ObjectType
} from 'typeorm';
import { Student } from './Student';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'primary_email' })
  public primaryEmail: string;

  @Column()
  public name: string;

  @OneToMany(
    (): ObjectType<Student> => Student,
    (student: Student): User => student.user
  )
  public students: Student[];
}
