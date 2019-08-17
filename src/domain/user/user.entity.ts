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
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ApiModelProperty({ required: true, example: 'name@gmail.com' })
  @Column({ name: 'primary_email', unique: true })
  public primaryEmail: string;

  @ApiModelProperty({ required: true, example: 'user_name' })
  @Column()
  public name: string;

  @OneToMany(
    (): ObjectType<Student> => Student,
    (student: Student): User => student.user
  )
  public students: Student[];
}
