import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async function (password) {
    return await bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async function (plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
