import { Controller, Body, Get, Post } from '@nestjs/common';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { StudentErrorService } from './studentError.service';
import { Student } from './student.entity';

@ApiUseTags('student')
@Controller('student')
export class StudentController {
  private readonly studentService: StudentService;

  private readonly studentError: StudentErrorService;

  public constructor(
    studentService: StudentService,
    studentError: StudentErrorService
  ) {
    this.studentService = studentService;
    this.studentError = studentError;
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
  public async create(@Body() student: Student): Promise<Student> {
    let newStudent;
    try {
      newStudent = await this.studentService.create(student);
    } catch (e) {
      this.studentError.resolveStudentCreate(e);
    }
    return newStudent;
  }
}
