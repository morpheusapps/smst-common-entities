import { Module } from '@nestjs/common';
import { DbErrorHandler } from './DbErrorHandler';
import { GetDomainErrorByErrorMessageModule } from '../../utils/GetDomainErrorByErrorMessage';

@Module({
  imports: [GetDomainErrorByErrorMessageModule],
  providers: [DbErrorHandler],
  exports: [DbErrorHandler]
})
export class DbErrorHandlerModule {}

export { DbErrorHandler } from './DbErrorHandler';
