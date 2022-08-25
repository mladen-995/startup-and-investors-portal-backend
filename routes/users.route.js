const usersController = require("../controllers/users.controller");
const { validationResult } = require("express-validator");
const db = require("../models");

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const data = await usersController.login(email, password);
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

        const user = getUserFromRequestBody(req, true);
        const userProfile = getInvestorUserProfileFromRequestBody(req);
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

        const user = getUserFromRequestBody(req, true);
        const userProfile = getStartupUserProfileFromRequestBody(req);
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

        const user = getUserFromRequestBody(req);
        user.id = userId;
        const userProfile = getInvestorUserProfileFromRequestBody(req);
        userProfile.userId = userId;
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

        const user = getUserFromRequestBody(req);
        user.id = userId;
        const userProfile = getStartupUserProfileFromRequestBody(req);
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

        const user = getUserFromRequestBody(req);
        user.id = userId;
        await usersController.updateAdministrator(user);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

function getUserFromRequestBody(req, includePassword = false) {
    const { email, password, firstName, lastName, middleName } = req.body;
    const res = { 
        email, 
        firstName, 
        lastName, 
        middleName
    };
    if (includePassword) {
        res.password = password;
    }
    return res;
}

function getStartupUserProfileFromRequestBody(req) {
    const { tin, legalEntityName, website, establishmentDate, registrationNumber,
        address, municipality, city, country, phone, facebookLink, twitterLink,
        linkedInLink, instagramLink, businessType, employeeNumber, currentCompanyPhase, 
        lastThreeYearIncome, lastThreeYearProfit, projectProposal, requiredAmountOfMoney, 
        intellectualPropertyStatus, patentInfo, logo } = req.body;
    return {
        tin, 
        legalEntityName, 
        website, 
        establishmentDate, 
        registrationNumber,
        address, 
        municipality, 
        city, 
        country, 
        phone, 
        facebookLink, 
        twitterLink,
        linkedInLink, 
        instagramLink, 
        businessType, 
        employeeNumber, 
        currentCompanyPhase, 
        lastThreeYearIncome, 
        lastThreeYearProfit, 
        projectProposal, 
        requiredAmountOfMoney, 
        intellectualPropertyStatus, 
        patentInfo, 
        logo,
    };
}

function getInvestorUserProfileFromRequestBody(req) {
    const { tin, legalEntityName, website, establishmentDate, registrationNumber,
        address, municipality, city, country, phone, facebookLink, twitterLink,
        linkedInLink, instagramLink, businessType, employeeNumber, currentCompanyPhase, 
        lastThreeYearIncome, lastThreeYearProfit, investorType, providedServiceTypes, 
        minAmountOfMoney, maxAmountOfMoney, logo } = req.body;
    return {
        tin, 
        legalEntityName, 
        website, 
        establishmentDate, 
        registrationNumber,
        address, 
        municipality, 
        city, 
        country, 
        phone, 
        facebookLink, 
        twitterLink,
        linkedInLink, 
        instagramLink, 
        businessType, 
        employeeNumber, 
        currentCompanyPhase, 
        lastThreeYearIncome, 
        lastThreeYearProfit, 
        investorType, 
        providedServiceTypes, 
        minAmountOfMoney, 
        maxAmountOfMoney, 
        logo,
    };
}

module.exports = {
    login,
    registerStartup,
    registerInvestor,
    updateInvestor,
    updateStartup,
    updateAdministrator,
};
