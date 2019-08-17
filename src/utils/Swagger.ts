import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const Swagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('COMMON-ENTITIES')
    .setDescription('Common-Entities API description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
};
