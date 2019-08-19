import request from 'supertest';
import { Test } from '@nestjs/testing';
import {
  INestApplication,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student } from './student.entity';
import { StudentErrorInterceptor } from './studentError.interceptor';
import { FakeStudent } from './student.fake';
import { Fakes } from '../../../tests/Fakes';

describe('/student', (): void => {
  let app: INestApplication;
  let server: unknown;

  const createTestApp = async (studentServiceMock: unknown): Promise<void> => {
    const studentServiceProvider = {
      provide: StudentService,
      useValue: studentServiceMock
    };
    const studentModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [studentServiceProvider]
    })
      .overrideInterceptor(StudentErrorInterceptor)
      .useValue({})
      .compile();

    app = studentModule.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  };

  afterAll((): void => {
    app.close();
  });

  describe('GET', (): void => {
    test('200', async (): Promise<void> => {
      const expectedStudents = [FakeStudent(), FakeStudent()];
      const studentServiceMock = { getAll: (): Student[] => expectedStudents };

      await createTestApp(studentServiceMock);

      const response = await request(server).get('/student');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedStudents);
    });

    test('500', async (): Promise<void> => {
      const studentServiceMock = {
        getAll: (): Student[] => {
          throw new InternalServerErrorException();
        }
      };

      await createTestApp(studentServiceMock);

      const response = await request(server).get('/student');
      expect(response.status).toBe(500);
    });
  });

  describe('POST', (): void => {
    test('201', async (): Promise<void> => {
      const expectedStudent = FakeStudent();
      const studentServiceMock = { create: (): Student => expectedStudent };

      await createTestApp(studentServiceMock);

      const studentCredentials = FakeStudent();
      const response = await request(server)
        .post('/student')
        .send(studentCredentials);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expectedStudent);
    });

    test('400', async (): Promise<void> => {
      const studentServiceMock = {
        create: (): Student => {
          throw new BadRequestException();
        }
      };

      await createTestApp(studentServiceMock);

      const response = await request(server).post('/student');
      expect(response.status).toBe(400);
    });

    test('409', async (): Promise<void> => {
      const studentServiceMock = {
        create: (): Student => {
          throw new ConflictException();
        }
      };

      await createTestApp(studentServiceMock);

      const response = await request(server).post('/student');
      expect(response.status).toBe(409);
    });

    test('500', async (): Promise<void> => {
      const studentServiceMock = {
        create: (): Student => {
          throw new InternalServerErrorException();
        }
      };

      await createTestApp(studentServiceMock);

      const response = await request(server).post('/student');
      expect(response.status).toBe(500);
    });
  });

  describe(':id', (): void => {
    let studentId: string;

    beforeEach((): void => {
      studentId = Fakes.uuid();
    });

    describe('GET', (): void => {
      test('200', async (): Promise<void> => {
        const expectedStudent = FakeStudent();
        const studentServiceMock = {
          getStudent: (): Student => expectedStudent
        };

        await createTestApp(studentServiceMock);

        const response = await request(server).get(`/student/${studentId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedStudent);
      });

      test('400', async (): Promise<void> => {
        const studentServiceMock = {
          getStudent: (): Student[] => {
            throw new BadRequestException();
          }
        };

        await createTestApp(studentServiceMock);

        const response = await request(server).get(`/student/${studentId}`);
        expect(response.status).toBe(400);
      });

      test('404', async (): Promise<void> => {
        const studentServiceMock = {
          getStudent: (): Student[] => {
            throw new NotFoundException();
          }
        };

        await createTestApp(studentServiceMock);

        const response = await request(server).get(`/student/${studentId}`);
        expect(response.status).toBe(404);
      });

      test('500', async (): Promise<void> => {
        const studentServiceMock = {
          getStudent: (): Student[] => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(studentServiceMock);

        const response = await request(server).get(`/student/${studentId}`);
        expect(response.status).toBe(500);
      });
    });

    describe('PUT', (): void => {
      test('200', async (): Promise<void> => {
        const expectedStudent = FakeStudent();
        const studentServiceMock = {
          getStudent: (): Student => expectedStudent,
          create: (): Student => {
            throw new InternalServerErrorException();
          },
          updateStudent: (): Student => expectedStudent
        };

        await createTestApp(studentServiceMock);

        const studentCredentials = FakeStudent();
        const response = await request(server)
          .put(`/student/${studentId}`)
          .send(studentCredentials);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedStudent);
      });

      test('201', async (): Promise<void> => {
        const expectedStudent = FakeStudent();
        const studentServiceMock = {
          getStudent: (): Student => {
            throw new NotFoundException();
          },
          create: (): Student => expectedStudent,
          updateStudent: (): Student => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(studentServiceMock);

        const studentCredentials = FakeStudent();
        const response = await request(server)
          .put(`/student/${studentId}`)
          .send(studentCredentials);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(expectedStudent);
      });

      test('400', async (): Promise<void> => {
        const studentServiceMock = {
          getStudent: (): Student => {
            throw new BadRequestException();
          },
          create: (): Student => {
            throw new InternalServerErrorException();
          },
          updateStudent: (): Student => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(studentServiceMock);

        const response = await request(server).put(`/student/${studentId}`);
        expect(response.status).toBe(400);
      });

      test('500', async (): Promise<void> => {
        const studentServiceMock = {
          getStudent: (): Student => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(studentServiceMock);

        const response = await request(server).put(`/student/${studentId}`);
        expect(response.status).toBe(500);
      });
    });

    describe('DELETE', (): void => {
      test('204', async (): Promise<void> => {
        const expectedStudent = FakeStudent();
        const studentServiceMock = {
          getStudent: (): Student => expectedStudent,
          removeStudent: (): void => {}
        };

        await createTestApp(studentServiceMock);

        const response = await request(server).delete(`/student/${studentId}`);
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
      });
      test('400', async (): Promise<void> => {
        const studentServiceMock = {
          getStudent: (): Student[] => {
            throw new BadRequestException();
          },
          removeStudent: (): void => {}
        };

        await createTestApp(studentServiceMock);

        const response = await request(server).delete(`/student/${studentId}`);
        expect(response.status).toBe(400);
      });
      test('404', async (): Promise<void> => {
        const studentServiceMock = {
          getStudent: (): Student[] => {
            throw new NotFoundException();
          },
          removeStudent: (): void => {}
        };

        await createTestApp(studentServiceMock);

        const response = await request(server).delete(`/student/${studentId}`);
        expect(response.status).toBe(404);
      });
      test('500', async (): Promise<void> => {
        const studentServiceMock = {
          getStudent: (): Student[] => {
            throw new InternalServerErrorException();
          },
          removeStudent: (): void => {}
        };

        await createTestApp(studentServiceMock);

        const response = await request(server).delete(`/student/${studentId}`);
        expect(response.status).toBe(500);
      });
    });

    describe('PATCH', (): void => {
      test('200', async (): Promise<void> => {
        const expectedStudent = FakeStudent();
        const studentServiceMock = {
          getStudent: (): Student => expectedStudent,
          updateStudent: (): Student => expectedStudent
        };

        await createTestApp(studentServiceMock);

        const studentCredentials = FakeStudent();
        const response = await request(server)
          .patch(`/student/${studentId}`)
          .send(studentCredentials);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedStudent);
      });
      test('400', async (): Promise<void> => {
        const studentServiceMock = {
          getStudent: (): Student[] => {
            throw new BadRequestException();
          },
          updateStudent: (): Student => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(studentServiceMock);

        const studentCredentials = FakeStudent();
        const response = await request(server)
          .patch(`/student/${studentId}`)
          .send(studentCredentials);
        expect(response.status).toBe(400);
      });
      test('404', async (): Promise<void> => {
        const studentServiceMock = {
          getStudent: (): Student[] => {
            throw new NotFoundException();
          },
          updateStudent: (): Student => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(studentServiceMock);

        const studentCredentials = FakeStudent();
        const response = await request(server)
          .patch(`/student/${studentId}`)
          .send(studentCredentials);
        expect(response.status).toBe(404);
      });
      test('500', async (): Promise<void> => {
        const studentServiceMock = {
          getStudent: (): Student[] => {
            throw new InternalServerErrorException();
          },
          updateStudent: (): Student => {
            throw new BadRequestException();
          }
        };

        await createTestApp(studentServiceMock);

        const studentCredentials = FakeStudent();
        const response = await request(server)
          .patch(`/student/${studentId}`)
          .send(studentCredentials);
        expect(response.status).toBe(500);
      });
    });
  });
});
