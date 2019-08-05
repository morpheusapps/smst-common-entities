import {
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../utils/ErrorService';

@Injectable()
export class StudentErrorService extends ErrorService
  implements NestInterceptor {
  protected keysToFieldsMap: { [key: string]: string } = {
    email: 'email',
    schoolId: 'school',
    userId: 'user'
  };

  public resolveStudentError({
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

  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    return next
      .handle()
      .pipe(
        catchError(
          (error: Error & { detail: string }): Observable<never> =>
            this.resolveStudentError(error)
        )
      );
  }
}
