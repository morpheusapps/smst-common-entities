import { Module, Controller, Get, HttpCode } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('health')
@Controller('health')
class HealthController {
  @Get()
  @HttpCode(200)
  public health(): string {
    return 'OK';
  }
}

@Module({
  controllers: [HealthController]
})
export class HealthModule {}
