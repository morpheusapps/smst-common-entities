import { Controller, Body, Get, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.entity';

@Controller('student')
export class StudentController {
  private readonly studentService: StudentService;

  public constructor(studentService: StudentService) {
    this.studentService = studentService;
  }

  /**
   * @swagger
   *
   * /student:
   *   get:
   *     tags:
   *       - Student
   *     description: Get All Students
   *     parameters: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: OK
   */
  @Get()
  public getAll(): Promise<Student[]> {
    return this.studentService.getAll();
  }

  /**
   * @swagger
   *
   * /student:
   *   post:
   *     tags:
   *       - Student
   *     description: Create Student
   *     parameters:
   *       - name: Student
   *         in: body
   *         description: Student Credentials
   *         schema:
   *          properties:
   *            email:
   *              type: string
   *              example: "email@gmail.com"
   *            schoolId:
   *              type: number
   *              example: 1234
   *            userId:
   *              type: number
   *              example: 1234
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: OK
   */
  @Post()
  public create(@Body() student: Student): Promise<Student> {
    return this.studentService.create(student);
  }
}
