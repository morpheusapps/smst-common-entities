import { DbErrorHandler } from '../DbErrorHandler';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GlobalErrorHandler {
  private dbErrorHandler: DbErrorHandler;

  public constructor(dbErrorHandler: DbErrorHandler) {
    this.dbErrorHandler = dbErrorHandler;
  }

  public handle = (
    keysToFieldsMap: { [key: string]: string },
    error: Error & { detail: string }
  ): void => {
    if (error.name === 'QueryFailedError') {
      return this.dbErrorHandler.handle({
        keysToFieldsMap,
        message: error.message,
        detail: error.detail
      });
    }

    if (error.name === 'EntityNotFound') {
      throw new NotFoundException();
    }
  };
}
