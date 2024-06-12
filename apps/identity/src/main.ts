import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(IdentityModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // if (process.env.NODE_ENV !== 'production') {
  const options = new DocumentBuilder()
    .setTitle('ecom Hub identity')
    .setDescription('ecom africa api hub user registration - identity')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 4001;
  await app.listen(PORT, () => {
    console.log(`... Identity API on PORT ${PORT}`);
  });
}
bootstrap();
