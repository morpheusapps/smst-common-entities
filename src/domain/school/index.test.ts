import request from 'supertest';
import { Test } from '@nestjs/testing';
import {
  INestApplication,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { School } from './school.entity';
import { SchoolErrorInterceptor } from './schoolError.interceptor';
import { FakeSchool } from './school.fake';
import { Fakes } from '../../../tests/Fakes';

describe('/school', (): void => {
  let app: INestApplication;
  let server: unknown;

  const createTestApp = async (schoolServiceMock: unknown): Promise<void> => {
    const schoolServiceProvider = {
      provide: SchoolService,
      useValue: schoolServiceMock
    };
    const schoolModule = await Test.createTestingModule({
      controllers: [SchoolController],
      providers: [schoolServiceProvider]
    })
      .overrideInterceptor(SchoolErrorInterceptor)
      .useValue({})
      .compile();

    app = schoolModule.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  };

  afterAll((): void => {
    app.close();
  });

  describe('GET', (): void => {
    test('200', async (): Promise<void> => {
      const expectedSchools = [FakeSchool(), FakeSchool()];
      const schoolServiceMock = { getAll: (): School[] => expectedSchools };

      await createTestApp(schoolServiceMock);

      const response = await request(server).get('/school');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedSchools);
    });

    test('500', async (): Promise<void> => {
      const schoolServiceMock = {
        getAll: (): School[] => {
          throw new InternalServerErrorException();
        }
      };

      await createTestApp(schoolServiceMock);

      const response = await request(server).get('/school');
      expect(response.status).toBe(500);
    });
  });

  describe('POST', (): void => {
    test('201', async (): Promise<void> => {
      const expectedSchool = FakeSchool();
      const schoolServiceMock = { create: (): School => expectedSchool };

      await createTestApp(schoolServiceMock);

      const schoolCredentials = FakeSchool();
      const response = await request(server)
        .post('/school')
        .send(schoolCredentials);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expectedSchool);
    });

    test('400', async (): Promise<void> => {
      const schoolServiceMock = {
        create: (): School => {
          throw new BadRequestException();
        }
      };

      await createTestApp(schoolServiceMock);

      const response = await request(server).post('/school');
      expect(response.status).toBe(400);
    });

    test('409', async (): Promise<void> => {
      const schoolServiceMock = {
        create: (): School => {
          throw new ConflictException();
        }
      };

      await createTestApp(schoolServiceMock);

      const response = await request(server).post('/school');
      expect(response.status).toBe(409);
    });

    test('500', async (): Promise<void> => {
      const schoolServiceMock = {
        create: (): School => {
          throw new InternalServerErrorException();
        }
      };

      await createTestApp(schoolServiceMock);

      const response = await request(server).post('/school');
      expect(response.status).toBe(500);
    });
  });

  describe(':id', (): void => {
    let schoolId: string;

    beforeEach((): void => {
      schoolId = Fakes.uuid();
    });

    describe('GET', (): void => {
      test('200', async (): Promise<void> => {
        const expectedSchool = FakeSchool();
        const schoolServiceMock = {
          getSchool: (): School => expectedSchool
        };

        await createTestApp(schoolServiceMock);

        const response = await request(server).get(`/school/${schoolId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedSchool);
      });

      test('400', async (): Promise<void> => {
        const schoolServiceMock = {
          getSchool: (): School[] => {
            throw new BadRequestException();
          }
        };

        await createTestApp(schoolServiceMock);

        const response = await request(server).get(`/school/${schoolId}`);
        expect(response.status).toBe(400);
      });

      test('404', async (): Promise<void> => {
        const schoolServiceMock = {
          getSchool: (): School[] => {
            throw new NotFoundException();
          }
        };

        await createTestApp(schoolServiceMock);

        const response = await request(server).get(`/school/${schoolId}`);
        expect(response.status).toBe(404);
      });

      test('500', async (): Promise<void> => {
        const schoolServiceMock = {
          getSchool: (): School[] => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(schoolServiceMock);

        const response = await request(server).get(`/school/${schoolId}`);
        expect(response.status).toBe(500);
      });
    });

    describe('PUT', (): void => {
      test('200', async (): Promise<void> => {
        const expectedSchool = FakeSchool();
        const schoolServiceMock = {
          getSchool: (): School => expectedSchool,
          create: (): School => {
            throw new InternalServerErrorException();
          },
          updateSchool: (): School => expectedSchool
        };

        await createTestApp(schoolServiceMock);

        const schoolCredentials = FakeSchool();
        const response = await request(server)
          .put(`/school/${schoolId}`)
          .send(schoolCredentials);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedSchool);
      });

      test('201', async (): Promise<void> => {
        const expectedSchool = FakeSchool();
        const schoolServiceMock = {
          getSchool: (): School => {
            throw new NotFoundException();
          },
          create: (): School => expectedSchool,
          updateSchool: (): School => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(schoolServiceMock);

        const schoolCredentials = FakeSchool();
        const response = await request(server)
          .put(`/school/${schoolId}`)
          .send(schoolCredentials);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(expectedSchool);
      });

      test('400', async (): Promise<void> => {
        const schoolServiceMock = {
          getSchool: (): School => {
            throw new BadRequestException();
          },
          create: (): School => {
            throw new InternalServerErrorException();
          },
          updateSchool: (): School => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(schoolServiceMock);

        const response = await request(server).put(`/school/${schoolId}`);
        expect(response.status).toBe(400);
      });

      test('500', async (): Promise<void> => {
        const schoolServiceMock = {
          getSchool: (): School => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(schoolServiceMock);

        const response = await request(server).put(`/school/${schoolId}`);
        expect(response.status).toBe(500);
      });
    });

    describe('DELETE', (): void => {
      test('204', async (): Promise<void> => {
        const expectedSchool = FakeSchool();
        const schoolServiceMock = {
          getSchool: (): School => expectedSchool,
          removeSchool: (): void => {}
        };

        await createTestApp(schoolServiceMock);

        const response = await request(server).delete(`/school/${schoolId}`);
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
      });
      test('400', async (): Promise<void> => {
        const schoolServiceMock = {
          getSchool: (): School[] => {
            throw new BadRequestException();
          },
          removeSchool: (): void => {}
        };

        await createTestApp(schoolServiceMock);

        const response = await request(server).delete(`/school/${schoolId}`);
        expect(response.status).toBe(400);
      });
      test('404', async (): Promise<void> => {
        const schoolServiceMock = {
          getSchool: (): School[] => {
            throw new NotFoundException();
          },
          removeSchool: (): void => {}
        };

        await createTestApp(schoolServiceMock);

        const response = await request(server).delete(`/school/${schoolId}`);
        expect(response.status).toBe(404);
      });
      test('500', async (): Promise<void> => {
        const schoolServiceMock = {
          getSchool: (): School[] => {
            throw new InternalServerErrorException();
          },
          removeSchool: (): void => {}
        };

        await createTestApp(schoolServiceMock);

        const response = await request(server).delete(`/school/${schoolId}`);
        expect(response.status).toBe(500);
      });
    });

    describe('PATCH', (): void => {
      test('200', async (): Promise<void> => {
        const expectedSchool = FakeSchool();
        const schoolServiceMock = {
          getSchool: (): School => expectedSchool,
          updateSchool: (): School => expectedSchool
        };

        await createTestApp(schoolServiceMock);

        const schoolCredentials = FakeSchool();
        const response = await request(server)
          .patch(`/school/${schoolId}`)
          .send(schoolCredentials);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedSchool);
      });
      test('400', async (): Promise<void> => {
        const schoolServiceMock = {
          getSchool: (): School[] => {
            throw new BadRequestException();
          },
          updateSchool: (): School => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(schoolServiceMock);

        const schoolCredentials = FakeSchool();
        const response = await request(server)
          .patch(`/school/${schoolId}`)
          .send(schoolCredentials);
        expect(response.status).toBe(400);
      });
      test('404', async (): Promise<void> => {
        const schoolServiceMock = {
          getSchool: (): School[] => {
            throw new NotFoundException();
          },
          updateSchool: (): School => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(schoolServiceMock);

        const schoolCredentials = FakeSchool();
        const response = await request(server)
          .patch(`/school/${schoolId}`)
          .send(schoolCredentials);
        expect(response.status).toBe(404);
      });
      test('500', async (): Promise<void> => {
        const schoolServiceMock = {
          getSchool: (): School[] => {
            throw new InternalServerErrorException();
          },
          updateSchool: (): School => {
            throw new BadRequestException();
          }
        };

        await createTestApp(schoolServiceMock);

        const schoolCredentials = FakeSchool();
        const response = await request(server)
          .patch(`/school/${schoolId}`)
          .send(schoolCredentials);
        expect(response.status).toBe(500);
      });
    });
  });
});
