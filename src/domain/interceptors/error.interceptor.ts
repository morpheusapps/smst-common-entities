import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import logger from '../../logger';

export abstract class ErrorInterceptor implements NestInterceptor {
  protected abstract resolveError(
    error: Error & { detail: string }
  ): Observable<never>;

  protected throwInternalError(
    properties: Record<string, unknown>,
    error: Error
  ): Observable<never> {
    logger.error(error.stack);
    throw new InternalServerErrorException(properties);
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
            this.resolveError(error)
        )
      );
  }
}
