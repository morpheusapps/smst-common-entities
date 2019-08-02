import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ObjectType
} from 'typeorm';
import { Student } from '../student';

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @OneToMany(
    (): ObjectType<Student> => Student,
    (student: Student): School => student.school
  )
  public students: Student[];
}
