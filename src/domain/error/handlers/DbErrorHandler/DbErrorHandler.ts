import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Injectable
} from '@nestjs/common';
import { DomainError, DbError } from '../../types/DomainError';
import { GetDomainErrorByErrorMessage } from '../../utils/GetDomainErrorByErrorMessage';
import logger from '../../../../logger';

const dbErrorMessagesToDomainErrorsMap: { [key: string]: DomainError } = {
  'violates foreign key constraint': DbError.FOREIGN_KEY_VIOLATION,
  'duplicate key value violates unique constraint': DbError.KEY_DUPLICATION,
  'violates not-null constraint': DbError.MISSING_KEY,
  'invalid input syntax for': DbError.INVALID_VALUE
};

@Injectable()
export class DbErrorHandler {
  private getDomainErrorByErrorMessageModule: (
    rawErrorMessage: string,
    errorMessagesToDomainErrorsMap: { [key: string]: DomainError }
  ) => DomainError | void;

  public constructor({
    execute: getDomainErrorByErrorMessageModule
  }: GetDomainErrorByErrorMessage) {
    this.getDomainErrorByErrorMessageModule = getDomainErrorByErrorMessageModule;
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
    const errorType = this.getDomainErrorByErrorMessageModule(
      message,
      dbErrorMessagesToDomainErrorsMap
    );
    switch (errorType) {
      case DbError.KEY_DUPLICATION: {
        const [key, value] = detail.match(/(?<=\().+?(?=\))/g);
        throw new ConflictException({
          message: 'conflict',
          field: keysToFieldsMap[key],
          value
        });
      }
      case DbError.FOREIGN_KEY_VIOLATION: {
        const [key, value] = detail.match(/(?<=\().+?(?=\))/g);
        throw new BadRequestException({
          message: 'invalid field',
          field: keysToFieldsMap[key],
          value
        });
      }
      case DbError.INVALID_VALUE: {
        const [value] = message.match(/(?<=").+?(?=")/);
        throw new BadRequestException({
          message: 'invalid value',
          value
        });
      }
      case DbError.MISSING_KEY: {
        const [key] = message.match(/(?<=").+?(?=")/);
        throw new BadRequestException({
          message: 'missing field',
          field: keysToFieldsMap[key]
        });
      }
      default:
        logger.error(
          `unknown QueryFailedError, message=${message} detail=${detail}`
        );
        throw new InternalServerErrorException({
          message: 'unknown error type'
        });
    }
  };
}
