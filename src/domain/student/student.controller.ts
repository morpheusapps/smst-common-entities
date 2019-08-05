import { Controller, Body, Get, Post } from '@nestjs/common';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { Student } from './student.entity';

@ApiUseTags('student')
@Controller('student')
export class StudentController {
  private readonly studentService: StudentService;

  public constructor(studentService: StudentService) {
    this.studentService = studentService;
  }

  @Get()
  public getAll(): Promise<Student[]> {
    return this.studentService.getAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Successfully created student',
    type: Student
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 500, description: 'Server error' })
  public create(@Body() student: Student): Promise<Student> {
    return this.studentService.create(student);
  }
}
