import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { School } from './school.entity';

@Injectable()
export class SchoolService {
  private readonly SchoolRepository: Repository<School>;

  public constructor(
    @InjectRepository(School)
    SchoolRepository: Repository<School>
  ) {
    this.SchoolRepository = SchoolRepository;
  }

  public getAll(): Promise<School[]> {
    return this.SchoolRepository.find();
  }

  public create(School: School): Promise<School> {
    return this.SchoolRepository.save(School);
  }

  public getSchool(id: string): Promise<School> {
    return this.SchoolRepository.findOneOrFail(id);
  }

  public updateSchool(School: School): Promise<School> {
    return this.SchoolRepository.save(School);
  }

  public removeSchool(id: string): Promise<DeleteResult> {
    return this.SchoolRepository.delete(id);
  }
}
