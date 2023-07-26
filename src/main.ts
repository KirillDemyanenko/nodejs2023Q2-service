import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as YAML from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const yamlFile = fs.readFileSync('doc/api.yaml', 'utf8');
  const document = SwaggerModule.createDocument(app, YAML.load(yamlFile));
  SwaggerModule.setup('doc', app, document);
  await app.listen(4000);
}
bootstrap();
