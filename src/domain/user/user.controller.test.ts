import { Response } from 'jest-express/lib/response';
import { Repository, DeleteResult } from 'typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { FakeUser } from './user.fake';
import { Fakes } from '../../../tests/Fakes';
import { NotFoundException } from '@nestjs/common';

describe('userController', (): void => {
  let userService: UserService;
  let userController: UserController;

  beforeEach((): void => {
    userService = new UserService(new Repository<User>());
    userController = new UserController(userService);
  });

  test('getAll', async (): Promise<void> => {
    const expectedUsers: User[] = [FakeUser(), FakeUser()];
    jest
      .spyOn(userService, 'getAll')
      .mockImplementation(
        (): Promise<User[]> => Promise.resolve(expectedUsers)
      );

    const users = await userController.getAll();
    expect(users).toBe(expectedUsers);
  });

  test('create', async (): Promise<void> => {
    const expectedUser: User = FakeUser();
    jest
      .spyOn(userService, 'create')
      .mockImplementation((user: User): Promise<User> => Promise.resolve(user));

    const user = await userController.create(expectedUser);
    expect(user).toBe(expectedUser);
  });

  test('getUser', async (): Promise<void> => {
    const expectedUser: User = FakeUser();
    jest
      .spyOn(userService, 'getUser')
      .mockImplementation((): Promise<User> => Promise.resolve(expectedUser));

    const user = await userController.getUser(Fakes.uuid());
    expect(user).toBe(expectedUser);
  });

  describe('updateOrCreate', (): void => {
    test('create', async (): Promise<void> => {
      const expectedUser: User = FakeUser();
      jest.spyOn(userService, 'getUser').mockImplementation(
        (): Promise<User> => {
          throw new NotFoundException();
        }
      );
      jest
        .spyOn(userService, 'create')
        .mockImplementation((): Promise<User> => Promise.resolve(expectedUser));

      const user = await userController.updateOrCreate(
        Fakes.uuid(),
        expectedUser,
        // @ts-ignore
        new Response()
      );
      expect(user).toBe(expectedUser);
    });

    test('update', async (): Promise<void> => {
      const expectedUser: User = FakeUser();
      jest
        .spyOn(userService, 'getUser')
        .mockImplementation((): Promise<User> => Promise.resolve(expectedUser));
      jest
        .spyOn(userService, 'updateUser')
        .mockImplementation((): Promise<User> => Promise.resolve(expectedUser));

      const user = await userController.updateOrCreate(
        Fakes.uuid(),
        expectedUser,
        // @ts-ignore
        new Response()
      );
      expect(user).toBe(expectedUser);
    });
  });

  describe('delete', (): void => {
    beforeEach((): void => {
      jest
        .spyOn(userService, 'removeUser')
        .mockImplementation(
          (): Promise<DeleteResult> => Promise.resolve(new DeleteResult())
        );
    });

    test('delete success', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      jest
        .spyOn(userService, 'getUser')
        .mockImplementation((): Promise<User> => Promise.resolve(FakeUser()));

      await userController.delete(expectedId);
      expect(userService.removeUser).toHaveBeenCalledWith(expectedId);
    });

    test('user not found', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      jest.spyOn(userService, 'getUser').mockImplementation(
        (): Promise<User> => {
          throw new Error();
        }
      );

      try {
        await userController.delete(expectedId);
      } catch (e) {}
      expect(userService.removeUser).not.toHaveBeenCalled();
    });
  });

  describe('update', (): void => {
    beforeEach((): void => {
      jest
        .spyOn(userService, 'updateUser')
        .mockImplementation(
          (user: User): Promise<User> => Promise.resolve(user)
        );
    });

    test('update success', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      const expectedUser = FakeUser({ id: expectedId });
      jest
        .spyOn(userService, 'getUser')
        .mockImplementation((): Promise<User> => Promise.resolve(FakeUser()));

      await userController.update(expectedId, expectedUser);
      expect(userService.updateUser).toHaveBeenCalledWith(expectedUser);
    });

    test('user not found', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      const expectedUser = FakeUser({ id: expectedId });
      jest.spyOn(userService, 'getUser').mockImplementation(
        (): Promise<User> => {
          throw new Error();
        }
      );

      try {
        await userController.update(expectedId, expectedUser);
      } catch (e) {}
      expect(userService.updateUser).not.toHaveBeenCalled();
    });
  });
});
