import { DbErrorHandler } from '../DbErrorHandler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalErrorHandler {
  private dbErrorHandler: DbErrorHandler;

  public constructor(dbErrorHandler: DbErrorHandler) {
    this.dbErrorHandler = dbErrorHandler;
  }

  public handle = (
    keysToFieldsMap: { [key: string]: string },
    { name, message, detail }: Error & { detail: string }
  ): void => {
    if (name === 'QueryFailedError') {
      this.dbErrorHandler.handle({
        keysToFieldsMap,
        message,
        detail
      });
    }
  };
}
