import { Module, Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('health')
@Controller('health')
class HealthController {
  @Get()
  public health(): void {}
}

@Module({
  controllers: [HealthController]
})
export class HealthModule {}
