import { Injectable } from "@nestjs/common";
import { SignupDto } from "src/users/dto/signup.dto";
import { UsersService } from "src/users/users.service";
import { AuthenticatedUser } from "./dto/authenticated-user.dto";
import { User } from "src/users/user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    public async signup(signupDto: SignupDto): Promise<AuthenticatedUser> {
        const user = await this.usersService.signup(signupDto);

        return await this._signin(user);
    }

    public async signin(signinDto: SignupDto): Promise<AuthenticatedUser> {
        const user = await this.usersService.signin(signinDto);

        return await this._signin(user);
    }

    private async _signin(user: User) {
        const payload = {
            id: user.id,
            name: user.name,
        };

        return {
            sub: user.id,
            name: user.name,
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
