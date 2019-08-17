import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserErrorInterceptor } from './userError.interceptor';
import { FakeUser } from './user.fake';

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
    test('GET 200', async (): Promise<void> => {
      const expectedUsers = [FakeUser(), FakeUser()];
      const userServiceMock = { getAll: (): User[] => expectedUsers };

      await createTestApp(userServiceMock);

      const response = await request(server).get('/user');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedUsers);
    });

    test('GET 500', async (): Promise<void> => {
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
});
