import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  Req,
  UnauthorizedException
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { GoogleAuthDto } from "./dto/google-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("google")
  async googleLogin(
    @Body() body: GoogleAuthDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.googleLogin(body.credential);

    response.cookie("fitcircle_session", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      expires: result.expiresAt
    });

    return {
      user: result.user,
      expiresAt: result.expiresAt
    };
  }

  @Get("me")
  async getCurrentUser(@Req() request: Request) {
    const sessionToken = request.cookies?.fitcircle_session;

    if (!sessionToken) {
      throw new UnauthorizedException("Not logged in");
    }

    return this.authService.verifySession(sessionToken);
  }

  @Post("logout")
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const sessionToken = request.cookies?.fitcircle_session;

    if (sessionToken) {
      await this.authService.logout(sessionToken);
    }

    response.clearCookie("fitcircle_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/"
    });

    return {
      message: "Logged out successfully"
    };
  }
}