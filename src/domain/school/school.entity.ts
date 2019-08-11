import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ObjectType
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Student } from '../student';

@Entity()
export class School {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ApiModelProperty({ required: true, example: 'school_name' })
  @Column({ unique: true })
  public name: string;

  @OneToMany(
    (): ObjectType<Student> => Student,
    (student: Student): School => student.school
  )
  public students: Student[];
}
