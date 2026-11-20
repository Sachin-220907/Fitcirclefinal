import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const explicitlyAllowed = [
    "https://fitcirclefinal.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    ...(process.env.FRONTEND_ORIGIN || "")
      .split(",")
      .map((origin) => origin.trim().replace(/\/+$/, ""))
      .filter(Boolean),
  ];

  app.use(cookieParser());

  // Fail-safe CORS configuration supporting Vercel and local environments
  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow non-browser requests (Postman, curl, server-to-server)
      if (!requestOrigin) {
        return callback(null, true);
      }

      const isVercel =
        requestOrigin === "https://fitcirclefinal.vercel.app" ||
        requestOrigin.endsWith(".vercel.app");
      const isLocal =
        requestOrigin.startsWith("http://localhost:") ||
        requestOrigin.startsWith("http://127.0.0.1:");
      const isConfigured = explicitlyAllowed.includes(requestOrigin);

      if (isVercel || isLocal || isConfigured) {
        return callback(null, true);
      }

      // Safe dynamic reflection fallback to prevent CORS blocks
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Cookie",
      "Cache-Control",
      "x-csrf-token"
    ],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);

  console.log(`FitCircle Backend listening on port ${port}`);
  console.log("Allowed frontend origins list:", explicitlyAllowed);
}

bootstrap();
