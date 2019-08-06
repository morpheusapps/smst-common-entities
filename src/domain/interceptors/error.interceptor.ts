import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export abstract class ErrorInterceptor implements NestInterceptor {
  protected abstract resolveError(
    error: Error & { detail: string }
  ): Observable<never>;

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
