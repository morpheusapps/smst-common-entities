import { Module, Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('health')
class HealthController {
  /**
   * @swagger
   *
   * /health:
   *   get:
   *     tags:
   *       - General
   *     description: Health Check
   *     parameters: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: OK
   */
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  @Get()
  health(@Res() res: Response): void {
    res.sendStatus(200);
  }
}

@Module({
  controllers: [HealthController]
})
export class HealthModule {}
