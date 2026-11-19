
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const defaultOrigin =
    process.env.NODE_ENV === "production"
      ? "https://fitcirclefinal.vercel.app"
      : "http://localhost:5173";

  const configuredOrigins = (process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  const allowedOrigins = Array.from(
    new Set([defaultOrigin, ...configuredOrigins])
  );

  app.use(cookieParser());

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);

  console.log(`FitCircle Backend listening on port ${port}`);
  console.log("Allowed frontend origins:", allowedOrigins);
}

bootstrap();
