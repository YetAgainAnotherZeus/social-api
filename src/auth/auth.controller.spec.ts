import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
    let authController: AuthController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
        }).compile();

        authController = app.get<AuthController>(AuthController);
    });

    describe("root", () => {
        it("should create an account", () => {
            expect(
                authController.signup({ name: "test", password: "test" }),
            ).toHaveProperty("accessToken");
        });

        it("should sign in", () => {
            expect(
                authController.signin({ name: "test", password: "test" }),
            ).toHaveProperty("accessToken");
        });
    });
});
