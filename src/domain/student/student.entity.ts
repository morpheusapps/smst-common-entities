import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ObjectType,
  ManyToOne
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { School } from '../school';
import { User } from '../user';

@Entity()
export class Student {
  @ApiModelProperty({
    readOnly: true,
    example: 'd69abc90-a8f3-4116-aeca-838ac72a8bd1'
  })
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ApiModelProperty({ required: true, example: 'name@gmail.com' })
  @Column({ unique: true })
  public email: string;

  @ApiModelProperty({
    required: true,
    example: 'd69abc90-a8f3-4116-aeca-838ac72a8bd1'
  })
  @ManyToOne(
    (): ObjectType<School> => School,
    (school: School): Student[] => school.students,
    { nullable: false }
  )
  public school: School;

  @ApiModelProperty({
    required: true,
    example: 'd69abc90-a8f3-4116-aeca-838ac72a8bd1'
  })
  @ManyToOne(
    (): ObjectType<User> => User,
    (user: User): Student[] => user.students,
    { nullable: false }
  )
  public user: User;
}
