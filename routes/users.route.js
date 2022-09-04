const lodash = require("lodash");
const usersController = require("../controllers/users.controller");
const { validationResult } = require("express-validator");
const db = require("../models");

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
        await usersController.updateInvestor(user, userProfile, t);
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
        await usersController.updateStartup(user, userProfile, t);
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
        await usersController.updateAdministrator(user);
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
        const profileFilter = getStartupUserProfileFromRequestObj(req.query, false, false);
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
};
