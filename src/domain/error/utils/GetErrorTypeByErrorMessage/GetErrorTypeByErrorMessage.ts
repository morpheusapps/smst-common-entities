import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ErrorType } from '../../types/ErrorType';

@Injectable()
export class GetErrorTypeByErrorMessage {
  public execute(
    rawErrorMessage: string,
    errorMessagesToErrorTypesMap: { [key: string]: ErrorType }
  ): ErrorType | void {
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
  }
}
