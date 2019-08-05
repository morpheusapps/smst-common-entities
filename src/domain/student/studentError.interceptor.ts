import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ErrorInterceptor } from '../utils/error.interceptor';

@Injectable()
export class StudentErrorInterceptor extends ErrorInterceptor {
  protected keysToFieldsMap: { [key: string]: string } = {
    email: 'email',
    schoolId: 'school',
    userId: 'user'
  };

  public resolveError({
    name,
    message,
    detail
  }: Error & { detail: string }): Observable<never> {
    if (name === 'QueryFailedError') {
      this.handleDbError({ message, detail });
    }

    throw new InternalServerErrorException({
      message: 'unknown error type'
    });
  }
}
