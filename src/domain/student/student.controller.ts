import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Put,
  Patch,
  HttpCode,
  Res,
  HttpStatus,
  Delete
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiImplicitParam } from '@nestjs/swagger';
import { Response } from 'express';
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
    delete student.id;
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
  public getStudent(@Param('id') id: string): Promise<Student> {
    return this.studentService.getStudent(id);
  }

  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated student',
    type: Student
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created student',
    type: Student
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 500, description: 'Server error' })
  public async updateOrCreate(
    @Param('id') id: string,
    @Body() student: Student,
    @Res() res: Response
  ): Promise<Student> {
    try {
      await this.studentService.getStudent(id);
    } catch (e) {
      const createdStudent = await this.studentService.create({
        ...student,
        id
      });
      res.status(HttpStatus.CREATED).send(createdStudent);
      return createdStudent;
    }
    const updatedStudent = await this.studentService.updateStudent({
      ...student,
      id
    });
    res.status(HttpStatus.OK).send(updatedStudent);
    return updatedStudent;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiResponse({
    status: 204,
    description: 'Successfully removed student',
    type: Student
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'No student has been found'
  })
  @ApiResponse({ status: 500, description: 'Server error' })
  public async delete(@Param('id') id: string): Promise<void> {
    await this.studentService.getStudent(id);
    this.studentService.removeStudent(id);
  }

  @Patch(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated student',
    type: Student
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'No student has been found'
  })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 500, description: 'Server error' })
  public async update(
    @Param('id') id: string,
    @Body() student: Student
  ): Promise<Student> {
    await this.studentService.getStudent(id);
    return this.studentService.updateStudent({ id, ...student });
  }
}
