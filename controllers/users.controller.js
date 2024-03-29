const usersService = require("../services/users.service");
const rolesService = require("../services/roles.service");
const adsService = require("../services/ads.service");
const notificationsService = require("../services/notifications.service");
const surveysService = require("../services/surveys.service");
const newsService = require("../services/news.service");
const discussionsService = require("../services/discussions.service");
const lodash = require("lodash");
const crypto = require("crypto");
const { ROLENAMES, STARTUPPOENTIALYPRIVATEFIELDS } = require("../utils/consts.util");
const { ApplicationError } = require("../utils/errors.util");
const { sendMail } = require("../utils/mail.util");
const emailTemplates = require("../utils/email-templates.util");

async function login(username, password) {
    const databaseUser = await usersService.getUserByUsername(username);
    if (!databaseUser || !databaseUser.password) {
        throw new ApplicationError("Username or Password not valid!", 401);
    }
    const checkUserPassword = await databaseUser.validPassword(password, databaseUser.password);
    if (!checkUserPassword) {
        throw new ApplicationError("Username or Password not valid!", 401);
    }
    if (databaseUser.roleId === 2) {
        let startupNotLoggedInAYear;
        if (databaseUser.lastLoginAt) {
            startupNotLoggedInAYear = new Date() - new Date(databaseUser.lastLoginAt) > (1000 * 3600 * 24*365);
            if (startupNotLoggedInAYear) {
                throw new ApplicationError("Startup has not logged in for over a year so the account is disabled!", 401);
            }
        }
    } else if (databaseUser.roleId === 3 && !databaseUser.approved) {
        throw new ApplicationError("User is not approved! A request has been sent to the administrator.", 401);
    }
    const token = usersService.createUserJWTToken(databaseUser.id, databaseUser.username);
    await usersService.setUserLastLoginAt(databaseUser.id);
    const user = await usersService.getUserAndProfile(databaseUser.id);
    if (user.profile) {
        formatUserProfile(user.profile);
    }
    const result = {
        token,
        user,
    };
    return result;
}

async function changePassword(userId, oldPassword, newPassword) {
    const databaseUser = await usersService.getUserById(userId);
    const checkUserPassword = await databaseUser.validPassword(oldPassword, databaseUser.password);
    if (!checkUserPassword) {
        throw new ApplicationError("Password not valid!", 401);
    }
    await databaseUser.update({ password: newPassword });
}

async function requestPasswordReset(username) {
    const databaseUser = await usersService.getUserByUsername(username);
    if (!databaseUser) {
        throw new ApplicationError("User with email doesn't exist!", 422);
    }
    const token = crypto.randomBytes(32).toString("hex");
    await usersService.createResetPasswordToken(databaseUser.id, token);
    const bodyPlain = "You have requested a password reset. To reset the password please go to this link " + process.env.CLIENT_URL + '/set-password?token=' + token;
    let bodyHTML = emailTemplates.getResetPasswordEmailTemplate();
    bodyHTML = bodyHTML.split("linkPlaceholder").join(process.env.CLIENT_URL + '/set-password?token=' + token);
    await sendMail("Password reset", databaseUser.email, bodyHTML, bodyPlain);
}

async function resetPassword(token, newPassword) {
    const tokenObject = await usersService.getTokenByToken(token);
    if (!tokenObject) {
        throw new ApplicationError("Invalid token!", 409);
    }
    const tokenTTL = process.env.PASSWORD_TOKEN_TTL;
    if(new Date(tokenObject.createdAt.getTime() + tokenTTL * 1000).getTime() < new Date().getTime()) {
        throw new ApplicationError("Restart password token expired!", 409);
    }
    const databaseUser = await usersService.getUserById(tokenObject.userId);
    await databaseUser.update({ password: newPassword });
    await tokenObject.destroy();
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
    const databaseUser = await usersService.createUser(user, transaction);
    userProfile.userId = databaseUser.id;
    await usersService.findOrCreateUserCreationRequest(databaseUser.id, transaction);
    await usersService.createInvestorUserProfile(userProfile, transaction);
    const mailText = "Your registration application has been created. We will notify you once the application is reviewed.";
    await sendMail("Registration application created", user.email, null, mailText);
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
    const databaseUser = await usersService.createUser(user, transaction);
    userProfile.userId = databaseUser.id;
    await usersService.createStartupUserProfile(userProfile, transaction);
    // await usersService.findOrCreateUserCreationRequest(databaseUser.id, transaction);
    await usersService.createStartupUserPublicFields(databaseUser.id, transaction);
    const mailText = "You have successfuly registered to the Startups and Investors portal.";
    await sendMail("Registration successful", user.email, null, mailText);
}

async function getInvestors(role, userFilter, profileFilter, pagination) {
    const attributes = {
        exclude: ["password"],
    };
    if (role !== ROLENAMES.ADMINISTARTOR) {
        delete userFilter.username;
        attributes.exclude.push("username");
    }
    const investors = await usersService.getInvestors(userFilter, profileFilter, pagination, attributes);
    for (let investor of investors) {
        formatUserProfile(investor.dataValues.investorProfile);
    }
    return investors;
}

async function getInvestor(role, investorId) {
    const isAdmin = role === ROLENAMES.ADMINISTARTOR;
    const investor = await usersService.getInvestor(investorId, isAdmin);
    formatUserProfile(investor.dataValues.investorProfile);
    return investor;
}

async function getStartups(userId, role, userFilter, profileFilter, pagination) {
    if (!await _canSearchStartups(userId, role)) {
        throw new ApplicationError("You don't have permission to search startups! Please create a request to the administrators.", 401);
    }
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
        formatUserProfile(startups[i].dataValues.startupProfile);
    }
    return startups;
}

async function getStartup(userId, role, startupId) {
    if (!await _canSearchStartups(userId, role)) {
        throw new ApplicationError("You don't have permission to search startups! Please create a request to the administrators.", 401);
    }
    const isAdmin = role === ROLENAMES.ADMINISTARTOR;
    const startup = await usersService.getStartup(startupId, isAdmin);
    removePrivateFieldsFromStartup(startup);
    formatUserProfile(startup.dataValues.startupProfile);
    return startup;
}

async function updateInvestor(userId, role, user, userProfile, transaction = null) {
    if (userId !== user.id && role !== ROLENAMES.ADMINISTARTOR) {
        throw new ApplicationError("Cannot update user!", 401);
    }
    const existingUser = await usersService.getUserById(userId);
    if (user.username && user.username !== existingUser.username) {
        const userWithUsername = await usersService.getUserByUsername(user.username);
        if (userWithUsername) {
            throw new ApplicationError("Username already in use!", 409);
        }
    }
    if (user.email && user.email !== existingUser.email) {
        const userWithEmail = await usersService.getUserByEmail(user.email);
        if (userWithEmail) {
            throw new ApplicationError("Email already in use!", 409);
        }
    }
    await usersService.updateUser(user, transaction);
    await usersService.updateInvestorUserProfile(userProfile, transaction);
}

async function updateStartup(userId, role, user, userProfile, transaction = null) {
    if (userId !== user.id && role !== ROLENAMES.ADMINISTARTOR) {
        throw new ApplicationError("Cannot update user!", 401);
    }
    const existingUser = await usersService.getUserById(userId);
    if (user.username && user.username !== existingUser.username) {
        const userWithUsername = await usersService.getUserByUsername(user.username);
        if (userWithUsername) {
            throw new ApplicationError("Username already in use!", 409);
        }
    }
    if (user.email && user.email !== existingUser.email) {
        const userWithEmail = await usersService.getUserByEmail(user.email);
        if (userWithEmail) {
            throw new ApplicationError("Email already in use!", 409);
        }
    }
    await usersService.updateUser(user, transaction);
    await usersService.updateStartupUserProfile(userProfile, transaction);
}

async function updateAdministrator(userId, role, user) {
    if (userId !== user.id && role !== ROLENAMES.ADMINISTARTOR) {
        throw new ApplicationError("Cannot update user!", 401);
    }
    const existingUser = await usersService.getUserById(userId);
    if (user.username && user.username !== existingUser.username) {
        const userWithUsername = await usersService.getUserByUsername(user.username);
        if (userWithUsername) {
            throw new ApplicationError("Username already in use!", 409);
        }
    }
    if (user.email && user.email !== existingUser.email) {
        const userWithEmail = await usersService.getUserByEmail(user.email);
        if (userWithEmail) {
            throw new ApplicationError("Email already in use!", 409);
        }
    }
    await usersService.updateUser(user);
}

async function getStartupPublicFields(userId, role, startupId) {
    if (userId !== startupId && role !== ROLENAMES.ADMINISTARTOR) {
        throw new ApplicationError("You can only get public fields for yourself!", 401);
    }
    return usersService.getStartupPublicFields(startupId);
}

async function updateStartupPublicFields(userId, startupId, startupPublicFields) {
    if (userId !== startupId) {
        throw new ApplicationError("You can only update public fields for yourself!", 401);
    }
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

async function getUserCreationRequests(userId) {
    let userCreationRequests = await usersService.getUserCreationRequests();
    for (let req of userCreationRequests) {
        if (req.userCreationRequest.roleId === 2) {
            req.dataValues.user = await getStartup(userId, ROLENAMES.ADMINISTARTOR, req.userId);
        } else if (req.userCreationRequest.roleId === 3) {
            req.dataValues.user = await getInvestor(ROLENAMES.ADMINISTARTOR, req.userId);
        }
        delete req.dataValues.userCreationRequest;
    }
    return userCreationRequests;
}

async function approveUserCreationRequest(requestId, t) {
    const request = await usersService.getUserCreationRequestById(requestId);
    await usersService.approveUser(request.userId, t);
    await usersService.deleteUserCreationRequest(requestId, t);
    const user = await usersService.getUserById(request.userId);
    const mailText = "Your registration application has been approved.";
    await sendMail("Registration application approved", user.email, null, mailText);
}

async function rejectUserCreationRequest(requestId, t) {
    await usersService.deleteUserCreationRequest(requestId, t);
    const request = await usersService.getUserCreationRequestById(requestId);
    const user = await usersService.getUserById(request.userId);
    const mailText = "Your registration application has been rejected.";
    await sendMail("Registration application rejected", user.email, null, mailText);
}

async function getInvestorSearchRequests() {
    let userCreationRequests = await usersService.getInvestorSearchRequests();
    for (let req of userCreationRequests) {
        req.dataValues.user = await getInvestor(ROLENAMES.ADMINISTARTOR, req.userId);
    }
    return userCreationRequests;
}

async function approveInvestorSearchRequest(requestId, t) {
    const request = await usersService.getInvestorSearchRequestById(requestId);
    await usersService.approveInvestorSearchRequest(request.userId, t);
    await usersService.deleteInvestorSearchRequest(requestId, t);
    const user = await usersService.getUserById(request.userId);
    const mailText = "Your startups search request has been approved.";
    await sendMail("Startups search request approved", user.email, null, mailText);
}

async function rejectInvestorSearchRequest(requestId, t) {
    await usersService.deleteInvestorSearchRequest(requestId, t);
    const request = await usersService.getInvestorSearchRequestById(requestId);
    const user = await usersService.getUserById(request.userId);
    const mailText = "Your startups search request has been rejected.";
    await sendMail("Startups search request rejected", user.email, null, mailText);
}

async function createInvestorSearchRequest(investorId) {
    return usersService.findOrCreateInvestorSearchRequest(investorId);
}

async function muteInvestor(userId, investorId) {
    if (userId === investorId) {
        throw new ApplicationError("You can't mute yourself!", 422);
    }
    return usersService.findOrCreateInvestorMutePair(userId, investorId);
}

async function unmuteInvestor(userId, investorId) {
    return usersService.deleteInvestorMutePair(userId, investorId);
}

async function getInvestorMutePairs(userId) {
     let pairs = await usersService.getInvestorMutePairs(userId);
     for (let pair of pairs) {
        pair.dataValues.user = await getInvestor(ROLENAMES.STARTUP, pair.investorId);
     }
     return pairs;
}

async function getInvestorCanSearchStartups(userId) {
    const canSearchStartups = await _canSearchStartups(userId, ROLENAMES.INVESTOR);
    const requestExists = !!await usersService.getInvestorSearchRequestByUserId(userId);
    return {
        canSearchStartups,
        requestExists,
    };
}

async function getStatistics(dateFrom, dateTo) {
    const usersCount = await usersService.getUsersCreatedInTimePeriodCount(dateFrom, dateTo);
    const adsCount = await adsService.getAdsCreatedInTimePeriodCount(dateFrom, dateTo);
    const notificationsCount = await notificationsService.getNotificationsCreatedInTimePeriodCount(dateFrom, dateTo);
    const discussionsCount = await discussionsService.getDiscussionsCreatedInTimePeriodCount(dateFrom, dateTo);
    const surveysCount = await surveysService.getSurveysCreatedInTimePeriodCount(dateFrom, dateTo);
    const newsCount = await newsService.getNewsCreatedInTimePeriodCount(dateFrom, dateTo);
    return {
        usersCount,
        adsCount,
        notificationsCount,
        discussionsCount,
        surveysCount,
        newsCount,
    };
}

async function _canSearchStartups(investorId, role) {
    if (role === ROLENAMES.INVESTOR) {
        const investor = await getInvestor(role, investorId);
        return investor.investorProfile.canSearchStartups;
    }
    return true;
}

function formatUserProfile(userProfile) {
    if (userProfile.streetNumberStartupUserProfiles) {
        userProfile.dataValues.streetNumber = userProfile.streetNumberStartupUserProfiles.name;
        delete userProfile.dataValues.streetNumberStartupUserProfiles;
    }
    if (userProfile.streetStartupUserProfiles) {
        userProfile.dataValues.street = userProfile.streetStartupUserProfiles.name;
        delete userProfile.dataValues.streetStartupUserProfiles;
    }
    if (userProfile.municipalityStartupUserProfiles) {
        userProfile.dataValues.municipality = userProfile.municipalityStartupUserProfiles.name;
        delete userProfile.dataValues.municipalityStartupUserProfiles;
    }
    if (userProfile.cityStartupUserProfiles) {
        userProfile.dataValues.city = userProfile.cityStartupUserProfiles.name;
        delete userProfile.dataValues.cityStartupUserProfiles;
    }
    if (userProfile.countryStartupUserProfiles) {
        userProfile.dataValues.country = userProfile.countryStartupUserProfiles.name;
        delete userProfile.dataValues.countryStartupUserProfiles;
    }
    if (userProfile.businessTypesStartups) {
        userProfile.dataValues.businessType = userProfile.businessTypesStartups.name;
        delete userProfile.dataValues.businessTypesStartups;
    }
    if (userProfile.areasOfInterestsStartups) {
        userProfile.dataValues.areasOfInterest = userProfile.areasOfInterestsStartups.name;
        delete userProfile.dataValues.areasOfInterestsStartups;
    }
    if (userProfile.profesionalSkillsStartups) {
        userProfile.dataValues.profesionalSkills = userProfile.profesionalSkillsStartups.name;
        delete userProfile.dataValues.profesionalSkillsStartups;
    }
    if (userProfile.streetNumberInvestorUserProfiles) {
        userProfile.dataValues.streetNumber = userProfile.streetNumberInvestorUserProfiles.name;
        delete userProfile.dataValues.streetNumberInvestorUserProfiles;
    }
    if (userProfile.streetInvestorUserProfiles) {
        userProfile.dataValues.street = userProfile.streetInvestorUserProfiles.name;
        delete userProfile.dataValues.streetInvestorUserProfiles;
    }
    if (userProfile.municipalityInvestorUserProfiles) {
        userProfile.dataValues.municipality = userProfile.municipalityInvestorUserProfiles.name;
        delete userProfile.dataValues.municipalityInvestorUserProfiles;
    }
    if (userProfile.cityInvestorUserProfiles) {
        userProfile.dataValues.city = userProfile.cityInvestorUserProfiles.name;
        delete userProfile.dataValues.cityInvestorUserProfiles;
    }
    if (userProfile.countryInvestorUserProfiles) {
        userProfile.dataValues.country = userProfile.countryInvestorUserProfiles.name;
        delete userProfile.dataValues.countryInvestorUserProfiles;
    }
    if (userProfile.businessTypesInvestors) {
        userProfile.dataValues.businessType = userProfile.businessTypesInvestors.name;
        delete userProfile.dataValues.businessTypesInvestors;
    }
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
    getUserCreationRequests,
    approveUserCreationRequest,
    getInvestorSearchRequests,
    approveInvestorSearchRequest,
    createInvestorSearchRequest,
    muteInvestor,
    unmuteInvestor,
    getInvestorMutePairs,
    changePassword,
    requestPasswordReset,
    resetPassword,
    getInvestorCanSearchStartups,
    rejectInvestorSearchRequest,
    rejectUserCreationRequest,
    getStatistics,
};
