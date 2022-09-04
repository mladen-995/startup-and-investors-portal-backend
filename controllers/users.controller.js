const usersService = require("../services/users.service");
const rolesService = require("../services/roles.service");
const { ROLENAMES } = require("../utils/consts");
const { ApplicationError } = require("../utils/errors");

async function login(username, password) {
    const databaseUser = await usersService.getUserByUsername(username);
    if (!databaseUser || !databaseUser.password) {
        throw new ApplicationError("Username or Password not valid!", 401);
    }
    const checkUserPassword = await databaseUser.validPassword(password, databaseUser.password);
    if (!checkUserPassword) {
        throw new ApplicationError("Username or Password not valid!", 401);
    }
    const token = usersService.createUserJWTToken(databaseUser.id, databaseUser.username);
    const user = await usersService.getUserAndProfile(databaseUser.id);
    const result = {
        token,
        user,
    };
    return result;
}

async function registerInvestor(user, userProfile, transaction = null) {
    const userWithUsername = await usersService.getUserByUsername(user.username);
    if (userWithUsername) {
        throw new ApplicationError("Username already in use!", 409);
    }
    const userWithEmail = await usersService.getUserByEmail(user.email);
    if (userWithEmail) {
        throw new ApplicationError("Email already in use!", 409);
    }
    const investorRole = await rolesService.getRoleByName(ROLENAMES.INVESTOR);
    user.roleId = investorRole.id;
    // @TODO disable user until an administrator approves it
    const databaseUser = await usersService.createUser(user, transaction);
    userProfile.userId = databaseUser.id;
    await usersService.createInvestorUserProfile(userProfile, transaction);
}

async function registerStartup(user, userProfile, transaction = null) {
    const userWithUsername = await usersService.getUserByUsername(user.username);
    if (userWithUsername) {
        throw new ApplicationError("Username already in use!", 409);
    }
    const userWithEmail = await usersService.getUserByEmail(user.email);
    if (userWithEmail) {
        throw new ApplicationError("Email already in use!", 409);
    }
    const startupRole = await rolesService.getRoleByName(ROLENAMES.STARTUP);
    user.roleId = startupRole.id;
    // @TODO disable user until an administrator approves it
    const databaseUser = await usersService.createUser(user, transaction);
    userProfile.userId = databaseUser.id;
    await usersService.createStartupUserProfile(userProfile, transaction);
}

async function getInvestors(role, userFilter, profileFilter, pagination) {
    let attributes;
    if (role !== ROLENAMES.ADMINISTARTOR) {
        delete userFilter.username;
        attributes = {
            exclude: ["username"],
        };
    }
    return usersService.getInvestors(userFilter, profileFilter, pagination, attributes);
}

async function getInvestor(role, investorId) {
    const isAdmin = role === ROLENAMES.ADMINISTARTOR;
    return usersService.getInvestor(investorId, isAdmin);
}

async function updateInvestor(user, userProfile, transaction = null) {
    await usersService.updateUser(user, transaction);
    await usersService.updateInvestorUserProfile(userProfile, transaction);
}

async function updateStartup(user, userProfile, transaction = null) {
    await usersService.updateUser(user, transaction);
    await usersService.updateStartupUserProfile(userProfile, transaction);
}

async function updateAdministrator(user) {
    await usersService.updateUser(user);
}


module.exports = {
    login,
    registerInvestor,
    registerStartup,
    updateAdministrator,
    updateInvestor,
    updateStartup,
    getInvestors,
    getInvestor,
};
