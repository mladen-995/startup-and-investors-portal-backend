const lodash = require("lodash");
const usersController = require("../controllers/users.controller");
const { validationResult } = require("express-validator");
const db = require("../models");
const { STARTUPPOENTIALYPRIVATEFIELDS } = require("../utils/consts");

async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        const data = await usersController.login(username, password);
        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (err) {
        next(err);
    }
}

async function requestPasswordReset(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { username } = req.body;
        const url = await usersController.requestPasswordReset(username);
        res.status(200).json({
            success: true,
            data: url,
        });
    } catch (err) {
        next(err);
    }
}

async function resetPassword(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { newPassword } = req.body;
        const token = req.params.token;
        await usersController.resetPassword(token, newPassword);
        res.status(200).json({
            success: true,
        });
    } catch (err) {
        next(err);
    }
}

async function registerInvestor(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const user = getUserFromRequestObject(req.body, true);
        const userProfile = getInvestorUserProfileFromRequestObject(req.body);
        await usersController.registerInvestor(user, userProfile, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function registerStartup(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }

        const user = getUserFromRequestObject(req.body, true);
        const userProfile = getStartupUserProfileFromRequestObj(req.body);
        await usersController.registerStartup(user, userProfile, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function updateInvestor(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        // check if admin or self update
        const { userId } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }

        const user = getUserFromRequestObject(req.body);
        user.id = userId;
        let userProfile = getInvestorUserProfileFromRequestObject(req.body);
        userProfile.userId = userId;
        const userProfileFields = ["tin", "businessTypeId", "website", "legalEntityName", "phone"];
        userProfile = lodash.pick(userProfile, userProfileFields);
        await usersController.updateInvestor(req.userId, req.role, user, userProfile, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function updateStartup(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        // check if admin or self update
        const { userId } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }

        const user = getUserFromRequestObject(req.body);
        user.id = userId;
        const userProfile = getStartupUserProfileFromRequestObj(req.body);
        userProfile.userId = userId;
        await usersController.updateStartup(req.userId, req.role, user, userProfile, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function updateAdministrator(req, res, next) {
    try {
        // check if admin
        const { userId } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }

        const user = getUserFromRequestObject(req.body);
        user.id = userId;
        await usersController.updateAdministrator(req.userId, req.role, user);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getInvestors(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const userFilter = getUserFromRequestObject(req.query);
        const profileFilter = getInvestorUserProfileFromRequestObject(req.query, false, false);
        const investors = await usersController.getInvestors(req.role, userFilter, profileFilter, pagination);
        // obrisi username u pretrazi(osim adminu)
        res.status(200).json({
            success: true,
            data: investors,
        });
    } catch(err) {
        next(err);
    }
}

async function getInvestor(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const investorId = req.params.investorId;
        const investor = await usersController.getInvestor(req.role, investorId);
        res.status(200).json({
            success: true,
            data: investor,
        });
    } catch(err) {
        next(err);
    }
}

async function getStartups(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const userFilter = getUserFromRequestObject(req.query);
        const profileFilter = getStartupUserProfileFromRequestObj(req.query, false, false);
        const startups = await usersController.getStartups(req.userId, req.role, userFilter, profileFilter, pagination);
        // obrisi username u pretrazi(osim adminu)
        res.status(200).json({
            success: true,
            data: startups,
        });
    } catch(err) {
        next(err);
    }
}

async function getStartup(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const startupId = req.params.startupId;
        const startup = await usersController.getStartup(req.userId, req.role, startupId);
        res.status(200).json({
            success: true,
            data: startup,
        });
    } catch(err) {
        next(err);
    }
}

async function getStartupPublicFields(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const startupId = req.params.startupId;
        const startupPublicFields = await usersController.getStartupPublicFields(req.userId, req.role, startupId);
        res.status(200).json({
            success: true,
            data: startupPublicFields,
        });
    } catch(err) {
        next(err);
    }
}

async function updateStartupPublicFields(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const startupPublicFields = lodash.pick(req.body, STARTUPPOENTIALYPRIVATEFIELDS.USER.concat(STARTUPPOENTIALYPRIVATEFIELDS.USERPROFILE));
        const startupId = req.params.startupId;
        await usersController.updateStartupPublicFields(req.userId, startupId, startupPublicFields);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function changePassword(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { oldPassword, newPassword } = req.body;
        const startupPublicFields = await usersController.changePassword(req.userId, oldPassword, newPassword);
        res.status(200).json({
            success: true,
            data: startupPublicFields,
        });
    } catch(err) {
        next(err);
    }
}

async function getUserCreationRequests(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const requests = await usersController.getUserCreationRequests(req.userId);
        res.status(200).json({
            success: true,
            data: requests
        });
    } catch(err) {
        next(err);
    }
}

async function approveUserCreationRequest(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const requestId = req.params.requestId;
        await usersController.approveUserCreationRequest(requestId, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function rejectUserCreationRequest(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const requestId = req.params.requestId;
        await usersController.rejectUserCreationRequest(requestId, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function getInvestorSearchRequests(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const requests = await usersController.getInvestorSearchRequests();
        res.status(200).json({
            success: true,
            data: requests
        });
    } catch(err) {
        next(err);
    }
}

async function approveInvestorSearchRequest(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const requestId = req.params.requestId;
        await usersController.approveInvestorSearchRequest(requestId, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function rejectInvestorSearchRequest(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const requestId = req.params.requestId;
        await usersController.rejectInvestorSearchRequest(requestId, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function createInvestorSearchRequest(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        await usersController.createInvestorSearchRequest(req.userId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function muteInvestor(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const investorId = req.params.investorId;
        await usersController.muteInvestor(req.userId, investorId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function unmuteInvestor(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const investorId = req.params.investorId;
        await usersController.unmuteInvestor(req.userId, investorId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getInvestorMutePairs(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const investors = await usersController.getInvestorMutePairs(req.userId);
        res.status(200).json({
            success: true,
            data: investors,
        });
    } catch(err) {
        next(err);
    }
}

async function getInvestorCanSearchStartups(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { canSearchStartups, requestExists } = await usersController.getInvestorCanSearchStartups(req.userId);
        res.status(200).json({
            success: true,
            data: {
                canSearchStartups,
                requestExists
            },
        });
    } catch(err) {
        next(err);
    }
}

function getUserFromRequestObject(obj, includePassword = false) {
    const userFields = ["username", "email", "firstName", "lastName", "middleName"];
    if (includePassword) {
        userFields.push("password");
    }
    const res = lodash.pick(obj, userFields);
    return res;
}

function getStartupUserProfileFromRequestObj(obj) {
    const userProfileFields = ["tin", "legalEntityName", "website", "establishmentDate", "registrationNumber",
        "streetId", "streetNumberId", "municipalityId", "cityId", "countryId", "phone", "facebookLink", "twitterLink",
        "linkedInLink", "instagramLink", "businessTypeId", "employeeNumber", "currentCompanyPhase", 
        "lastThreeYearIncome", "lastThreeYearProfit", "projectProposal", "requiredAmountOfMoney", 
        "intellectualPropertyStatus", "patentInfo", "logo", "areasOfInterestId", "profesionalSkillsId"];
    const res = lodash.pick(obj, userProfileFields);
    return res;
}

function getInvestorUserProfileFromRequestObject(obj) {
    const userProfileFields = ["tin", "legalEntityName", "website", "establishmentDate", "registrationNumber",
        "streetId", "streetNumberId", "municipalityId", "cityId", "countryId", "phone", "facebookLink", "twitterLink",
        "linkedInLink", "instagramLink", "businessTypeId", "employeeNumber", "currentCompanyPhase", 
        "lastThreeYearIncome", "lastThreeYearProfit", "investorType", "providedServiceTypes", 
        "minAmountOfMoney", "maxAmountOfMoney", "logo"];
    const res = lodash.pick(obj, userProfileFields);
    return res;
}

module.exports = {
    login,
    registerStartup,
    registerInvestor,
    updateInvestor,
    updateStartup,
    updateAdministrator,
    getInvestors,
    getInvestor,
    getStartupPublicFields,
    updateStartupPublicFields,
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
    rejectUserCreationRequest,
    rejectInvestorSearchRequest,
};
