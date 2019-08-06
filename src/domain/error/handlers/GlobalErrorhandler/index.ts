import { Module, Global } from '@nestjs/common';
import { DbErrorHandlerModule } from '../DbErrorHandler';
import { GlobalErrorHandler } from './GlobalErrorHandler';

@Global()
@Module({
  imports: [DbErrorHandlerModule],
  providers: [GlobalErrorHandler],
  exports: [GlobalErrorHandler]
})
export class GlobalErrorHandlerModule {}

export { GlobalErrorHandler } from './GlobalErrorHandler';
