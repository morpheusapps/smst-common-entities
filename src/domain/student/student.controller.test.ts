import { Response } from 'jest-express/lib/response';
import { Repository, DeleteResult } from 'typeorm';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './student.entity';
import { FakeStudent } from './student.fake';
import { Fakes } from '../../../tests/Fakes';
import { NotFoundException } from '@nestjs/common';

describe('studentController', (): void => {
  let studentService: StudentService;
  let studentController: StudentController;

  beforeEach((): void => {
    studentService = new StudentService(new Repository<Student>());
    studentController = new StudentController(studentService);
  });

  test('getAll', async (): Promise<void> => {
    const expectedStudents: Student[] = [FakeStudent(), FakeStudent()];
    jest
      .spyOn(studentService, 'getAll')
      .mockImplementation(
        (): Promise<Student[]> => Promise.resolve(expectedStudents)
      );

    const students = await studentController.getAll();
    expect(students).toBe(expectedStudents);
  });

  test('create', async (): Promise<void> => {
    const expectedStudent: Student = FakeStudent();
    jest
      .spyOn(studentService, 'create')
      .mockImplementation(
        (student: Student): Promise<Student> => Promise.resolve(student)
      );

    const student = await studentController.create(expectedStudent);
    expect(student).toBe(expectedStudent);
  });

  test('getStudent', async (): Promise<void> => {
    const expectedStudent: Student = FakeStudent();
    jest
      .spyOn(studentService, 'getStudent')
      .mockImplementation(
        (): Promise<Student> => Promise.resolve(expectedStudent)
      );

    const student = await studentController.getStudent(Fakes.uuid());
    expect(student).toBe(expectedStudent);
  });

  describe('updateOrCreate', (): void => {
    test('create', async (): Promise<void> => {
      const expectedStudent: Student = FakeStudent();
      jest.spyOn(studentService, 'getStudent').mockImplementation(
        (): Promise<Student> => {
          throw new NotFoundException();
        }
      );
      jest
        .spyOn(studentService, 'create')
        .mockImplementation(
          (): Promise<Student> => Promise.resolve(expectedStudent)
        );

      const student = await studentController.updateOrCreate(
        Fakes.uuid(),
        expectedStudent,
        // @ts-ignore
        new Response()
      );
      expect(student).toBe(expectedStudent);
    });

    test('update', async (): Promise<void> => {
      const expectedStudent: Student = FakeStudent();
      jest
        .spyOn(studentService, 'getStudent')
        .mockImplementation(
          (): Promise<Student> => Promise.resolve(expectedStudent)
        );
      jest
        .spyOn(studentService, 'updateStudent')
        .mockImplementation(
          (): Promise<Student> => Promise.resolve(expectedStudent)
        );

      const student = await studentController.updateOrCreate(
        Fakes.uuid(),
        expectedStudent,
        // @ts-ignore
        new Response()
      );
      expect(student).toBe(expectedStudent);
    });
  });

  describe('delete', (): void => {
    beforeEach((): void => {
      jest
        .spyOn(studentService, 'removeStudent')
        .mockImplementation(
          (): Promise<DeleteResult> => Promise.resolve(new DeleteResult())
        );
    });

    test('delete success', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      jest
        .spyOn(studentService, 'getStudent')
        .mockImplementation(
          (): Promise<Student> => Promise.resolve(FakeStudent())
        );

      await studentController.delete(expectedId);
      expect(studentService.removeStudent).toHaveBeenCalledWith(expectedId);
    });

    test('student not found', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      jest.spyOn(studentService, 'getStudent').mockImplementation(
        (): Promise<Student> => {
          throw new Error();
        }
      );

      try {
        await studentController.delete(expectedId);
      } catch (e) {}
      expect(studentService.removeStudent).not.toHaveBeenCalled();
    });
  });

  describe('patch', (): void => {
    beforeEach((): void => {
      jest
        .spyOn(studentService, 'updateStudent')
        .mockImplementation(
          (student: Student): Promise<Student> => Promise.resolve(student)
        );
    });

    test('patch success', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      const expectedStudent = FakeStudent({ id: expectedId });
      jest
        .spyOn(studentService, 'getStudent')
        .mockImplementation(
          (): Promise<Student> => Promise.resolve(FakeStudent())
        );

      await studentController.update(expectedId, expectedStudent);
      expect(studentService.updateStudent).toHaveBeenCalledWith(
        expectedStudent
      );
    });

    test('student not found', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      const expectedStudent = FakeStudent({ id: expectedId });
      jest.spyOn(studentService, 'getStudent').mockImplementation(
        (): Promise<Student> => {
          throw new Error();
        }
      );

      try {
        await studentController.update(expectedId, expectedStudent);
      } catch (e) {}
      expect(studentService.updateStudent).not.toHaveBeenCalled();
    });
  });
});
