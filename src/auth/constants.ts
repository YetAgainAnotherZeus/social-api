export const jwtConstants = {
    // Must use a string literal for some reason
    secret: `${process.env.JWT_SECRET}`,
};
