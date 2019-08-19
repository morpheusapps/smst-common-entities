import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Put,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  UseInterceptors,
  NotFoundException
} from '@nestjs/common';
import {
  ApiUseTags,
  ApiImplicitParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse
} from '@nestjs/swagger';
import { Response } from 'express';
import { StudentErrorInterceptor } from './studentError.interceptor';
import { StudentService } from './student.service';
import { Student } from './student.entity';

@Controller('student')
@UseInterceptors(StudentErrorInterceptor)
@ApiUseTags('student')
export class StudentController {
  private readonly studentService: StudentService;

  public constructor(studentService: StudentService) {
    this.studentService = studentService;
  }

  @Get()
  @ApiOkResponse({
    description: 'Successfully fetched students data',
    type: [Student]
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public getAll(): Promise<Student[]> {
    return this.studentService.getAll();
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Successfully created student',
    type: Student
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public create(@Body() student: Student): Promise<Student> {
    delete student.id;
    return this.studentService.create(student);
  }

  @Get(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Successfully fetched students data',
    type: [Student]
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({
    description: 'No student has been found'
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public getStudent(@Param('id') id: string): Promise<Student> {
    return this.studentService.getStudent(id);
  }

  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Successfully updated student',
    type: Student
  })
  @ApiCreatedResponse({
    description: 'Successfully created student',
    type: Student
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async updateOrCreate(
    @Param('id') id: string,
    @Body() student: Student,
    @Res() res: Response
  ): Promise<Student> {
    try {
      await this.studentService.getStudent(id);
    } catch (e) {
      if (!(e instanceof NotFoundException)) {
        throw e;
      }

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
  @ApiNoContentResponse({
    description: 'Successfully removed student',
    type: Student
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({
    description: 'No student has been found'
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async delete(@Param('id') id: string): Promise<void> {
    await this.studentService.getStudent(id);
    this.studentService.removeStudent(id);
  }

  @Patch(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Successfully updated student',
    type: Student
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({
    description: 'No student has been found'
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async update(
    @Param('id') id: string,
    @Body() student: Student
  ): Promise<Student> {
    await this.studentService.getStudent(id);
    return this.studentService.updateStudent({ id, ...student });
  }
}
