import { Controller, Body, Get, Post, Param } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiImplicitParam } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched students data',
    type: [Student]
  })
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

  @Get(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched students data',
    type: [Student]
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'No student has been found'
  })
  public getStudent(@Param() id: string): Promise<Student> {
    return this.studentService.getStudent(id);
  }
}
