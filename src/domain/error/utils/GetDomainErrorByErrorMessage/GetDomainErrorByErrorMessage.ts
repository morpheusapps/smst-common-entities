import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DomainError } from '../../types';

@Injectable()
export class GetDomainErrorByErrorMessage {
  public execute(
    rawErrorMessage: string,
    errorMessagesToDomainErrorsMap: { [key: string]: DomainError }
  ): DomainError | void {
    const relatedErrorMessage = Object.keys(
      errorMessagesToDomainErrorsMap
    ).find((errorMessageEntry: string): boolean =>
      rawErrorMessage.includes(errorMessageEntry)
    );
    if (!relatedErrorMessage) {
      throw new InternalServerErrorException({
        message: 'unknown error type'
      });
    }

    return errorMessagesToDomainErrorsMap[relatedErrorMessage];
  }
}
