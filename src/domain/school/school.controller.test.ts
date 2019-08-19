import { Response } from 'jest-express/lib/response';
import { Repository, DeleteResult } from 'typeorm';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { School } from './school.entity';
import { FakeSchool } from './school.fake';
import { Fakes } from '../../../tests/Fakes';
import { NotFoundException } from '@nestjs/common';

describe('schoolController', (): void => {
  let schoolService: SchoolService;
  let schoolController: SchoolController;

  beforeEach((): void => {
    schoolService = new SchoolService(new Repository<School>());
    schoolController = new SchoolController(schoolService);
  });

  test('getAll', async (): Promise<void> => {
    const expectedSchools: School[] = [FakeSchool(), FakeSchool()];
    jest
      .spyOn(schoolService, 'getAll')
      .mockImplementation(
        (): Promise<School[]> => Promise.resolve(expectedSchools)
      );

    const schools = await schoolController.getAll();
    expect(schools).toBe(expectedSchools);
  });

  test('create', async (): Promise<void> => {
    const expectedSchool: School = FakeSchool();
    jest
      .spyOn(schoolService, 'create')
      .mockImplementation(
        (school: School): Promise<School> => Promise.resolve(school)
      );

    const school = await schoolController.create(expectedSchool);
    expect(school).toBe(expectedSchool);
  });

  test('getSchool', async (): Promise<void> => {
    const expectedSchool: School = FakeSchool();
    jest
      .spyOn(schoolService, 'getSchool')
      .mockImplementation(
        (): Promise<School> => Promise.resolve(expectedSchool)
      );

    const school = await schoolController.getSchool(Fakes.uuid());
    expect(school).toBe(expectedSchool);
  });

  describe('updateOrCreate', (): void => {
    test('create', async (): Promise<void> => {
      const expectedSchool: School = FakeSchool();
      jest.spyOn(schoolService, 'getSchool').mockImplementation(
        (): Promise<School> => {
          throw new NotFoundException();
        }
      );
      jest
        .spyOn(schoolService, 'create')
        .mockImplementation(
          (): Promise<School> => Promise.resolve(expectedSchool)
        );

      const school = await schoolController.updateOrCreate(
        Fakes.uuid(),
        expectedSchool,
        // @ts-ignore
        new Response()
      );
      expect(school).toBe(expectedSchool);
    });

    test('update', async (): Promise<void> => {
      const expectedSchool: School = FakeSchool();
      jest
        .spyOn(schoolService, 'getSchool')
        .mockImplementation(
          (): Promise<School> => Promise.resolve(expectedSchool)
        );
      jest
        .spyOn(schoolService, 'updateSchool')
        .mockImplementation(
          (): Promise<School> => Promise.resolve(expectedSchool)
        );

      const school = await schoolController.updateOrCreate(
        Fakes.uuid(),
        expectedSchool,
        // @ts-ignore
        new Response()
      );
      expect(school).toBe(expectedSchool);
    });
  });

  describe('delete', (): void => {
    beforeEach((): void => {
      jest
        .spyOn(schoolService, 'removeSchool')
        .mockImplementation(
          (): Promise<DeleteResult> => Promise.resolve(new DeleteResult())
        );
    });

    test('delete success', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      jest
        .spyOn(schoolService, 'getSchool')
        .mockImplementation(
          (): Promise<School> => Promise.resolve(FakeSchool())
        );

      await schoolController.delete(expectedId);
      expect(schoolService.removeSchool).toHaveBeenCalledWith(expectedId);
    });

    test('school not found', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      jest.spyOn(schoolService, 'getSchool').mockImplementation(
        (): Promise<School> => {
          throw new Error();
        }
      );

      try {
        await schoolController.delete(expectedId);
      } catch (e) {}
      expect(schoolService.removeSchool).not.toHaveBeenCalled();
    });
  });

  describe('patch', (): void => {
    beforeEach((): void => {
      jest
        .spyOn(schoolService, 'updateSchool')
        .mockImplementation(
          (school: School): Promise<School> => Promise.resolve(school)
        );
    });

    test('patch success', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      const expectedSchool = FakeSchool({ id: expectedId });
      jest
        .spyOn(schoolService, 'getSchool')
        .mockImplementation(
          (): Promise<School> => Promise.resolve(FakeSchool())
        );

      await schoolController.update(expectedId, expectedSchool);
      expect(schoolService.updateSchool).toHaveBeenCalledWith(expectedSchool);
    });

    test('school not found', async (): Promise<void> => {
      const expectedId = Fakes.uuid();
      const expectedSchool = FakeSchool({ id: expectedId });
      jest.spyOn(schoolService, 'getSchool').mockImplementation(
        (): Promise<School> => {
          throw new Error();
        }
      );

      try {
        await schoolController.update(expectedId, expectedSchool);
      } catch (e) {}
      expect(schoolService.updateSchool).not.toHaveBeenCalled();
    });
  });
});
