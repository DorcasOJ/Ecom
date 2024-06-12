import { CoreModule } from './core.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // if (process.env.NODE_ENV !== 'production') {
  const options = new DocumentBuilder()
    .setTitle('ecom Hub core')
    .setDescription('ecom africa api hub user backend - core')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.CORE_PORT || 3002;
  await app.listen(PORT, () => {
    console.log(`... Core API on PORT ${PORT}`);
  });
}
bootstrap();
