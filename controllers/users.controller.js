const usersService = require("../services/users.service");
const rolesService = require("../services/roles.service");
const lodash = require("lodash");
const { ROLENAMES, STARTUPPOENTIALYPRIVATEFIELDS } = require("../utils/consts");
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
    // check if lastLogin is 1+y before, and if it is set approved to false and send a request to admin
    const token = usersService.createUserJWTToken(databaseUser.id, databaseUser.username);
    await usersService.setUserLastLoginAt(databaseUser.id);
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
    await usersService.createStartupUserPublicFields(databaseUser.id, transaction);
}

async function getInvestors(role, userFilter, profileFilter, pagination) {
    const attributes = {
        exclude: ["password"],
    };
    if (role !== ROLENAMES.ADMINISTARTOR) {
        delete userFilter.username;
        attributes.exclude.push("username");
    }
    return usersService.getInvestors(userFilter, profileFilter, pagination, attributes);
}

async function getInvestor(role, investorId) {
    const isAdmin = role === ROLENAMES.ADMINISTARTOR;
    return usersService.getInvestor(investorId, isAdmin);
}

async function getStartups(role, userFilter, profileFilter, pagination) {
    const attributes = {
        exclude: ["password"],
    };
    if (role !== ROLENAMES.ADMINISTARTOR) {
        delete userFilter.username;
        attributes.exclude.push("username");
    }
    let startupFieldsFilter = lodash.pick(userFilter, STARTUPPOENTIALYPRIVATEFIELDS.USER);
    startupFieldsFilter = {
        ...startupFieldsFilter,
        ...lodash.pick(profileFilter, STARTUPPOENTIALYPRIVATEFIELDS.USERPROFILE),
    };
    Object.keys(startupFieldsFilter).forEach((key) => {
        startupFieldsFilter[key] = true;
    });
    const startups = await usersService.getStartups(userFilter, profileFilter, startupFieldsFilter, pagination, attributes);
    for (let i = 0; i < startups.length; i++) {
        removePrivateFieldsFromStartup(startups[i]);
    }
    return startups;
}

async function getStartup(role, startupId) {
    const isAdmin = role === ROLENAMES.ADMINISTARTOR;
    const startup = await usersService.getStartup(startupId, isAdmin);
    removePrivateFieldsFromStartup(startup);
    return startup;
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

async function getStartupPublicFields(startupId) {
    return usersService.getStartupPublicFields(startupId);
}

async function updateStartupPublicFields(startupId, startupPublicFields) {
    return usersService.updateStartupPublicFields(startupId, startupPublicFields);
}

function removePrivateFieldsFromStartup(startup) {
    const privateFields = [];
    Object.keys(startup.startupProfile.startupPublicFields.dataValues).forEach((key) => {
        if (!startup.startupProfile.startupPublicFields[key]) {
            privateFields.push(key);
        }
    });
    delete startup.dataValues.startupProfile.dataValues.startupPublicFields;
    let startupProfileFieldsForRemoval = lodash.intersection(privateFields, STARTUPPOENTIALYPRIVATEFIELDS.USERPROFILE);
    let startupUserFieldsForRemoval = lodash.intersection(privateFields, STARTUPPOENTIALYPRIVATEFIELDS.USER);
    startupProfileFieldsForRemoval.forEach((key) => {
        delete startup.dataValues.startupProfile[key];
    });
    startupUserFieldsForRemoval.forEach((key) => {
        delete startup.dataValues[key];
    });
    return startup;
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
    updateStartupPublicFields,
    getStartupPublicFields,
    getStartups,
    getStartup,
};
