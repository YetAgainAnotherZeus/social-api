import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { SignupDto } from "./dto/signup.dto";
import { UserAlreadyExistsError } from "./error";
import { hashPassword } from "./password.helper";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    public async signup(signupDto: SignupDto): Promise<User> {
        const userExists = await this._findByAttr("name", signupDto.name);

        if (userExists) {
            throw new UserAlreadyExistsError();
        }

        const user = new User();
        user.name = signupDto.name;
        user.password = await hashPassword(signupDto.password);

        return this.usersRepository.save(user);
    }

    public async getAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    public async getById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    public async getByName(name: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { name } });
    }

    private async _findByAttr(attr: string, value: string) {
        return await this.usersRepository.findOne({ where: { [attr]: value } });
    }
}
