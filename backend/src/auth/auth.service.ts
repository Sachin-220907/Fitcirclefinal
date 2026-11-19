import {
  Injectable,
  UnauthorizedException,
  ConflictException
} from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { createHash, randomBytes } from "crypto";
import { AuthProvider } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
  );

  constructor(private readonly prisma: PrismaService) {}

  async googleLogin(credential: string) {
    let payload;

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException("Invalid Google credential");
    }

    if (
      !payload ||
      !payload.sub ||
      !payload.email ||
      !payload.email_verified
    ) {
      throw new UnauthorizedException("Invalid Google account");
    }

    let user = await this.prisma.user.findUnique({
      where: {
        email: payload.email
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        email: true,
        status: true
      }
    });

    const existingIdentity = await this.prisma.authIdentity.findUnique({
      where: {
        provider_providerAccountId: {
          provider: AuthProvider.GOOGLE,
          providerAccountId: payload.sub
        }
      },
      select: {
        user: {
          select: {
            id: true,
            displayName: true,
            username: true,
            email: true,
            status: true
          }
        }
      }
    });

    if (existingIdentity) {
      user = existingIdentity.user;
    } else if (user) {
      throw new ConflictException(
        "An account with this email already exists. Sign in using your existing login method."
      );
    } else {
      try {
        user = await this.prisma.user.create({
          data: {
            displayName: payload.name ?? null,
            email: payload.email,
            emailVerifiedAt: new Date(),
            authIdentities: {
              create: {
                provider: AuthProvider.GOOGLE,
                providerAccountId: payload.sub
              }
            }
          },
          select: {
            id: true,
            displayName: true,
            username: true,
            email: true,
            status: true
          }
        });
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2002"
        ) {
          throw new ConflictException("Account already exists");
        }

        throw error;
      }
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedException("This account is not active");
    }

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        lastLoginAt: new Date()
      }
    });

    const sessionToken = randomBytes(32).toString("hex");

    const tokenHash = createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await this.prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt
      }
    });

    return {
      user: {
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        email: user.email
      },
      sessionToken,
      expiresAt
    };
  }

  async verifySession(sessionToken: string) {
    const tokenHash = createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    const session = await this.prisma.session.findUnique({
      where: {
        tokenHash
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            username: true,
            email: true,
            status: true
          }
        }
      }
    });

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt <= new Date() ||
      session.user.status !== "ACTIVE"
    ) {
      throw new UnauthorizedException("Invalid or expired session");
    }

    return {
      id: session.user.id,
      displayName: session.user.displayName,
      username: session.user.username,
      email: session.user.email
    };
  }

  async logout(sessionToken: string) {
    const tokenHash = createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    await this.prisma.session.updateMany({
      where: {
        tokenHash,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });

    return {
      message: "Logged out successfully"
    };
  }
}