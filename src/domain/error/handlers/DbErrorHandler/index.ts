import { Module } from '@nestjs/common';
import { DbErrorHandler } from './DbErrorHandler';
import { GetErrorTypeByErrorMessageModule } from '../../utils/getErrorTypeByErrorMessage';

@Module({
  imports: [GetErrorTypeByErrorMessageModule],
  providers: [DbErrorHandler],
  exports: [DbErrorHandler]
})
export class DbErrorHandlerModule {}

export { DbErrorHandler } from './DbErrorHandler';
