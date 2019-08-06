import { Module } from '@nestjs/common';
import { GetErrorTypeByErrorMessage } from './GetErrorTypeByErrorMessage';

@Module({
  providers: [GetErrorTypeByErrorMessage],
  exports: [GetErrorTypeByErrorMessage]
})
export class GetErrorTypeByErrorMessageModule {}
export { GetErrorTypeByErrorMessage } from './GetErrorTypeByErrorMessage';
