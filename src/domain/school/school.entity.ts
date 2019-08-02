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

  @ApiModelProperty({ required: true, example: 'name@gmail.com' })
  @Column()
  public name: string;

  @ApiModelProperty({
    example: [
      'd69abc90-a8f3-4116-aeca-838ac72a8bd1',
      '2bd17fcf-cf42-4a55-8c6a-8f29afecc43f'
    ]
  })
  @OneToMany(
    (): ObjectType<Student> => Student,
    (student: Student): School => student.school
  )
  public students: Student[];
}
