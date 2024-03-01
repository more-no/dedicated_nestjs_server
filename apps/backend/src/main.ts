import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // reference https://docs.nestjs.com/openapi/introduction

  const config = new DocumentBuilder()
    .setTitle('Dedicated NestJS server')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //   First thing to notice above is the DocumentBuilder class. Basically, DocumentBuilder helps structure a base document. This document confirms to the OpenAPI specification. It allows us to set several properties such as title, description and so on. In the above example, we set the title, description, version and tag properties. Finally, we call the build() method to return an instance of the document.

  // Next, we call the createDocument() method from the SwaggerModule class. This method basically takes two arguments as input. First is the application instance. Second is the configuration document itself from the previous step. We can also provide a third argument to specify document options. We will check them in the next section.

  // Lastly, we call the setup() method from the SwaggerModule class. This method accepts several inputs as below:

  //     The path to mount the Swagger UI. In this case we specify the path as api. Basically, this means that the Swagger UI will be available on http://localhost:3000/api.
  //     An application instance.
  //     The document object instantiated in the previous step.
  //     Optional configuration options. In the above code, we don’t have them.

  app.useGlobalPipes(new ValidationPipe());
  app.listen(3000);
}
bootstrap();
