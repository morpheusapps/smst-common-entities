import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ErrorInterceptor } from '../interceptors';
import { GlobalErrorHandler } from '../error';

@Injectable()
export class SchoolErrorInterceptor extends ErrorInterceptor {
  private handleGlobalError: (
    keysToFieldsMap: { [key: string]: string },
    { name, message, detail }: Error & { detail: string }
  ) => void;

  protected keysToFieldsMap: { [key: string]: string } = {
    name: 'name'
  };

  public constructor({ handle: handleGlobalError }: GlobalErrorHandler) {
    super();
    this.handleGlobalError = handleGlobalError;
  }

  public resolveError(error: Error & { detail: string }): Observable<never> {
    this.handleGlobalError(this.keysToFieldsMap, error);

    throw new InternalServerErrorException({
      message: 'unknown error'
    });
  }
}
