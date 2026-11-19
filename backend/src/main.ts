import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = (
    process.env.FRONTEND_ORIGIN ||
    (process.env.NODE_ENV === "production" ? "" : "http://localhost:5173")
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (allowedOrigins.length === 0) {
    throw new Error("FRONTEND_ORIGIN must be set in production");
  }

  app.use(cookieParser());

  app.enableCors({
    origin: allowedOrigins,
    credentials: true
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`FitCircle Backend listening on port ${port}`);
}

bootstrap();