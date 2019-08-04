import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';

const keysToFieldsMap: { [key: string]: string } = {
  email: 'email',
  schoolId: 'school',
  userId: 'user'
};

enum ErrorType {
  FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',
  INVALID_VALUE = 'INVALID_VALUE',
  MISSING_KEY = 'MISSING_KEY',
  KEY_DUPLICATION = 'KEY_DUPLICATION'
}

const errorMessagesToErrorTypesMap: { [key: string]: ErrorType } = {
  'violates foreign key constraint': ErrorType.FOREIGN_KEY_VIOLATION,
  'duplicate key value violates unique constraint': ErrorType.KEY_DUPLICATION,
  'violates not-null constraint': ErrorType.MISSING_KEY,
  'invalid input syntax for': ErrorType.INVALID_VALUE
};

const getErrorType = (rawErrorMessage: string): ErrorType | void => {
  const relatedErrorMessage = Object.keys(errorMessagesToErrorTypesMap).find(
    (errorMessageEntry: string): boolean =>
      rawErrorMessage.includes(errorMessageEntry)
  );
  if (!relatedErrorMessage) {
    throw new InternalServerErrorException({
      message: 'unknown error type'
    });
  }

  return errorMessagesToErrorTypesMap[relatedErrorMessage];
};

const handleError = ({
  message,
  detail
}: {
  message: string;
  detail: string;
}): void => {
  const errorType = getErrorType(message);
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

@Injectable()
export class StudentErrorService {
  public resolveStudentCreate(
    error: Error & { message: string; detail: string }
  ): void {
    handleError({ message: error.message, detail: error.detail });
  }
}
