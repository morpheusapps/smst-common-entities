import request from 'supertest';
import { Test } from '@nestjs/testing';
import {
  INestApplication,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserErrorInterceptor } from './userError.interceptor';
import { FakeUser } from './user.fake';
import { Fakes } from '../../../tests/Fakes';

describe('/user', (): void => {
  let app: INestApplication;
  let server: unknown;

  const createTestApp = async (userServiceMock: unknown): Promise<void> => {
    const userServiceProvider = {
      provide: UserService,
      useValue: userServiceMock
    };
    const userModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceProvider]
    })
      .overrideInterceptor(UserErrorInterceptor)
      .useValue({})
      .compile();

    app = userModule.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  };

  afterAll((): void => {
    app.close();
  });

  describe('GET', (): void => {
    test('200', async (): Promise<void> => {
      const expectedUsers = [FakeUser(), FakeUser()];
      const userServiceMock = { getAll: (): User[] => expectedUsers };

      await createTestApp(userServiceMock);

      const response = await request(server).get('/user');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedUsers);
    });

    test('500', async (): Promise<void> => {
      const userServiceMock = {
        getAll: (): User[] => {
          throw new InternalServerErrorException();
        }
      };

      await createTestApp(userServiceMock);

      const response = await request(server).get('/user');
      expect(response.status).toBe(500);
    });
  });

  describe('POST', (): void => {
    test('201', async (): Promise<void> => {
      const expectedUser = FakeUser();
      const userServiceMock = { create: (): User => expectedUser };

      await createTestApp(userServiceMock);

      const userCredentials = FakeUser();
      const response = await request(server)
        .post('/user')
        .send(userCredentials);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expectedUser);
    });

    test('400', async (): Promise<void> => {
      const userServiceMock = {
        create: (): User => {
          throw new BadRequestException();
        }
      };

      await createTestApp(userServiceMock);

      const response = await request(server).post('/user');
      expect(response.status).toBe(400);
    });

    test('409', async (): Promise<void> => {
      const userServiceMock = {
        create: (): User => {
          throw new ConflictException();
        }
      };

      await createTestApp(userServiceMock);

      const response = await request(server).post('/user');
      expect(response.status).toBe(409);
    });

    test('500', async (): Promise<void> => {
      const userServiceMock = {
        create: (): User => {
          throw new InternalServerErrorException();
        }
      };

      await createTestApp(userServiceMock);

      const response = await request(server).post('/user');
      expect(response.status).toBe(500);
    });
  });

  describe(':id', (): void => {
    let userId: string;

    beforeEach((): void => {
      userId = Fakes.uuid();
    });

    describe('GET', (): void => {
      test('200', async (): Promise<void> => {
        const expectedUser = FakeUser();
        const userServiceMock = { getUser: (): User => expectedUser };

        await createTestApp(userServiceMock);

        const response = await request(server).get(`/user/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedUser);
      });

      test('400', async (): Promise<void> => {
        const userServiceMock = {
          getUser: (): User[] => {
            throw new BadRequestException();
          }
        };

        await createTestApp(userServiceMock);

        const response = await request(server).get(`/user/${userId}`);
        expect(response.status).toBe(400);
      });

      test('404', async (): Promise<void> => {
        const userServiceMock = {
          getUser: (): User[] => {
            throw new NotFoundException();
          }
        };

        await createTestApp(userServiceMock);

        const response = await request(server).get(`/user/${userId}`);
        expect(response.status).toBe(404);
      });

      test('500', async (): Promise<void> => {
        const userServiceMock = {
          getUser: (): User[] => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(userServiceMock);

        const response = await request(server).get(`/user/${userId}`);
        expect(response.status).toBe(500);
      });
    });

    describe('PUT', (): void => {
      test('200', async (): Promise<void> => {
        const expectedUser = FakeUser();
        const userServiceMock = {
          getUser: (): User => expectedUser,
          create: (): User => {
            throw new InternalServerErrorException();
          },
          updateUser: (): User => expectedUser
        };

        await createTestApp(userServiceMock);

        const userCredentials = FakeUser();
        const response = await request(server)
          .put(`/user/${userId}`)
          .send(userCredentials);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedUser);
      });

      test('201', async (): Promise<void> => {
        const expectedUser = FakeUser();
        const userServiceMock = {
          getUser: (): User => {
            throw new NotFoundException();
          },
          create: (): User => expectedUser,
          updateUser: (): User => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(userServiceMock);

        const userCredentials = FakeUser();
        const response = await request(server)
          .put(`/user/${userId}`)
          .send(userCredentials);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(expectedUser);
      });

      test('400', async (): Promise<void> => {
        const userServiceMock = {
          getUser: (): User => {
            throw new BadRequestException();
          },
          create: (): User => {
            throw new InternalServerErrorException();
          },
          updateUser: (): User => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(userServiceMock);

        const response = await request(server).put(`/user/${userId}`);
        expect(response.status).toBe(400);
      });

      test('500', async (): Promise<void> => {
        const userServiceMock = {
          getUser: (): User => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(userServiceMock);

        const response = await request(server).put(`/user/${userId}`);
        expect(response.status).toBe(500);
      });
    });

    describe('DELETE', (): void => {
      test('204', async (): Promise<void> => {
        const expectedUser = FakeUser();
        const userServiceMock = {
          getUser: (): User => expectedUser,
          removeUser: (): void => {}
        };

        await createTestApp(userServiceMock);

        const response = await request(server).delete(`/user/${userId}`);
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
      });
      test('400', async (): Promise<void> => {
        const userServiceMock = {
          getUser: (): User[] => {
            throw new BadRequestException();
          },
          removeUser: (): void => {}
        };

        await createTestApp(userServiceMock);

        const response = await request(server).delete(`/user/${userId}`);
        expect(response.status).toBe(400);
      });
      test('404', async (): Promise<void> => {
        const userServiceMock = {
          getUser: (): User[] => {
            throw new NotFoundException();
          },
          removeUser: (): void => {}
        };

        await createTestApp(userServiceMock);

        const response = await request(server).delete(`/user/${userId}`);
        expect(response.status).toBe(404);
      });
      test('500', async (): Promise<void> => {
        const userServiceMock = {
          getUser: (): User[] => {
            throw new InternalServerErrorException();
          },
          removeUser: (): void => {}
        };

        await createTestApp(userServiceMock);

        const response = await request(server).delete(`/user/${userId}`);
        expect(response.status).toBe(500);
      });
    });

    describe('PATCH', (): void => {
      test('200', async (): Promise<void> => {
        const expectedUser = FakeUser();
        const userServiceMock = {
          getUser: (): User => expectedUser,
          updateUser: (): User => expectedUser
        };

        await createTestApp(userServiceMock);

        const userCredentials = FakeUser();
        const response = await request(server)
          .patch(`/user/${userId}`)
          .send(userCredentials);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedUser);
      });
      test('400', async (): Promise<void> => {
        const userServiceMock = {
          getUser: (): User[] => {
            throw new BadRequestException();
          },
          updateUser: (): User => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(userServiceMock);

        const userCredentials = FakeUser();
        const response = await request(server)
          .patch(`/user/${userId}`)
          .send(userCredentials);
        expect(response.status).toBe(400);
      });
      test('404', async (): Promise<void> => {
        const userServiceMock = {
          getUser: (): User[] => {
            throw new NotFoundException();
          },
          updateUser: (): User => {
            throw new InternalServerErrorException();
          }
        };

        await createTestApp(userServiceMock);

        const userCredentials = FakeUser();
        const response = await request(server)
          .patch(`/user/${userId}`)
          .send(userCredentials);
        expect(response.status).toBe(404);
      });
      test('500', async (): Promise<void> => {
        const userServiceMock = {
          getUser: (): User[] => {
            throw new InternalServerErrorException();
          },
          updateUser: (): User => {
            throw new BadRequestException();
          }
        };

        await createTestApp(userServiceMock);

        const userCredentials = FakeUser();
        const response = await request(server)
          .patch(`/user/${userId}`)
          .send(userCredentials);
        expect(response.status).toBe(500);
      });
    });
  });
});
