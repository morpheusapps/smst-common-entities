import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  private readonly studentRepository: Repository<Student>;

  public constructor(
    @InjectRepository(Student)
    studentRepository: Repository<Student>
  ) {
    this.studentRepository = studentRepository;
  }

  public getAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  public create(student: Student): Promise<Student> {
    return this.studentRepository.save(student);
  }
}