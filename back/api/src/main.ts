import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

const SWAGGER_PATH = "swagger";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  // #region Swagger
  const config = new DocumentBuilder()
    .setTitle("COTON AUTOMATION - API")
    .setDescription("")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {});

  SwaggerModule.setup(SWAGGER_PATH, app, document);
  // #endregion Swagger

  console.info("Listen on " + process.env.PORT);
  await app.listen(process.env.PORT);
}

void bootstrap();
