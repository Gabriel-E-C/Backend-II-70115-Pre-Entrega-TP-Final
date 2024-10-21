import bcrypt, { genSaltSync } from "bcrypt";

const createHash = password => bcrypt.hashSync(password, genSaltSync(10));

const isValidPassword = (password, user) => bcrypt.compareSync (password, user.password);

export { createHash, isValidPassword };