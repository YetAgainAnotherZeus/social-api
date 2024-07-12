import { genSalt, hash, compare } from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => {
    const salt = await genSalt(SALT_ROUNDS);
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
};

export const matchPassword = async (
    password: string,
    hashedPassword: string,
) => {
    return await compare(password, hashedPassword);
};
