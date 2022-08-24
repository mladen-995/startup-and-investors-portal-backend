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
    const token = usersService.createUserJWTToken(databaseUser.id, databaseUser.email);
    return token;
}

async function registerInvestor(user, userProfile) {
    const investorRole = await rolesService.getRoleByName(ROLENAMES.INVESTOR);
    user.roleId = investorRole.id;
    // @TODO disable user until an administrator approves it
    const databaseUser = await usersService.createUser(user);
    userProfile.user_id = databaseUser.id;
    await usersService.createInvestorUserProfile(userProfile);
}

async function registerStartup(user, userProfile) {
    const startupRole = await rolesService.getRoleByName(ROLENAMES.STARTUP);
    user.roleId = startupRole.id;
    // @TODO disable user until an administrator approves it
    const databaseUser = await usersService.createUser(user);
    userProfile.user_id = databaseUser.id;
    await usersService.createStartupUserProfile(userProfile);
}


module.exports = {
    login,
    registerInvestor,
    registerStartup,
};
