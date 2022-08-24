const jwt = require("jsonwebtoken");
const usersService = require("../services/users.service");
const rolesService = require("../services/roles.service");
const { ROLENAMES } = require("../utils/consts");
const { ApplicationError } = require("../utils/errors");

async function login(email, password) {
    const databaseUser = await usersService.getUserByEmail(email);
    if (!databaseUser || !databaseUser.password) {
        throw new ApplicationError("Username or Password not valid!", 401);
    }
    const checkUserPassword = await databaseUser.validPassword(password, databaseUser.password);
    if (!checkUserPassword) {
        throw new ApplicationError("Username or Password not valid!", 401);
    }
    const token = createUserJWTToken(databaseUser.id, databaseUser.email);
    return token;
}

async function registerInvestor(email, password, firstName, lastName, middleName = null) {
    const investorRole = await rolesService.getRoleByName(ROLENAMES.INVESTITOR);
    return usersService.registerUser(email, password, firstName, lastName, investorRole.id, middleName);
}

async function registerStartup(email, password, firstName, lastName, middleName = null) {
    const startupRole = await rolesService.getRoleByName(ROLENAMES.STARTUP);
    return usersService.registerUser(email, password, firstName, lastName, startupRole.id, middleName);
}

function createUserJWTToken(id, email) {
    try {
        return jwt.sign(
            { userId: id, email: email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    } catch {
        throw new ApplicationError("Error signing jwt token!", 500);
    }
}

function decodeUserJWTToken(token) {
    try {
        token.split(' ')[1]; 
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken;
    } catch {
        throw new ApplicationError("Error decoding jwt token!", 500);
    }
}

module.exports = {
    login,
    registerInvestor,
    registerStartup,
    createUserJWTToken,
    decodeUserJWTToken,
};
