import { Module } from '@nestjs/common';
import { GetDomainErrorByErrorMessage } from './GetDomainErrorByErrorMessage';

@Module({
  providers: [GetDomainErrorByErrorMessage],
  exports: [GetDomainErrorByErrorMessage]
})
export class GetDomainErrorByErrorMessageModule {}
export { GetDomainErrorByErrorMessage } from './GetDomainErrorByErrorMessage';
