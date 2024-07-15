import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || "secret",
            signOptions: { expiresIn: "60s" },
        }),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
