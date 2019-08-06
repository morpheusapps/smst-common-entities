import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Injectable
} from '@nestjs/common';
import { ErrorType } from '../../types/ErrorType';
import { GetErrorTypeByErrorMessage } from '../../utils/GetErrorTypeByErrorMessage';

const dbErrorMessagesToErrorTypesMap: { [key: string]: ErrorType } = {
  'violates foreign key constraint': ErrorType.FOREIGN_KEY_VIOLATION,
  'duplicate key value violates unique constraint': ErrorType.KEY_DUPLICATION,
  'violates not-null constraint': ErrorType.MISSING_KEY,
  'invalid input syntax for': ErrorType.INVALID_VALUE
};

@Injectable()
export class DbErrorHandler {
  private getErrorTypeByErrorMessageModule: (
    rawErrorMessage: string,
    errorMessagesToErrorTypesMap: { [key: string]: ErrorType }
  ) => ErrorType | void;

  public constructor({
    execute: getErrorTypeByErrorMessageModule
  }: GetErrorTypeByErrorMessage) {
    this.getErrorTypeByErrorMessageModule = getErrorTypeByErrorMessageModule;
  }

  public handle = ({
    keysToFieldsMap,
    message,
    detail
  }: {
    keysToFieldsMap: { [key: string]: string };
    message: string;
    detail: string;
  }): void => {
    const errorType = this.getErrorTypeByErrorMessageModule(
      message,
      dbErrorMessagesToErrorTypesMap
    );
    switch (errorType) {
      case ErrorType.KEY_DUPLICATION: {
        const [key, value] = detail.match(/(?<=\().+?(?=\))/g);
        throw new ConflictException({
          message: 'conflict',
          field: keysToFieldsMap[key],
          value
        });
      }
      case ErrorType.FOREIGN_KEY_VIOLATION: {
        const [key, value] = detail.match(/(?<=\().+?(?=\))/g);
        throw new BadRequestException({
          message: 'invalid field',
          field: keysToFieldsMap[key],
          value
        });
      }
      case ErrorType.INVALID_VALUE: {
        const [value] = message.match(/(?<=").+?(?=")/);
        throw new BadRequestException({
          message: 'invalid value',
          value
        });
      }
      case ErrorType.MISSING_KEY: {
        const [key] = message.match(/(?<=").+?(?=")/);
        throw new BadRequestException({
          message: 'missing field',
          field: keysToFieldsMap[key]
        });
      }
      default:
        throw new InternalServerErrorException({
          message: 'unknown error type'
        });
    }
  };
}
