import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ErrorService } from '../utils/ErrorService';

@Injectable()
export class StudentErrorService extends ErrorService {
  protected keysToFieldsMap: { [key: string]: string } = {
    email: 'email',
    schoolId: 'school',
    userId: 'user'
  };

  public resolveStudentError({
    name,
    message,
    detail
  }: Error & { name: string; message: string; detail: string }): void {
    if (name === 'QueryFailedError') {
      this.handleDbError({ message, detail });
    }

    throw new InternalServerErrorException({
      message: 'unknown error type'
    });
  }
}
