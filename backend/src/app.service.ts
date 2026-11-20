import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: "ok",
      service: "FitCircle API",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}
