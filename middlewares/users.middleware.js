const usersService = require("../services/users.service");
const rolesService = require("../services/roles.service");
const { ROLENAMES } = require("../utils/consts.util");
const { ApplicationError } = require("../utils/errors.util");

async function checkUser(req, res, next) {    
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new ApplicationError("Auth token not provided!", 401);
        }
        const decodedToken = usersService.decodeUserJWTToken(token);
        req.userId = decodedToken.userId;
        const user = await usersService.getUserById(req.userId);
        const role = await rolesService.getRoleById(user.roleId);
        req.role = role.name;
        next();
    } catch (err) {
        next(err);
    }
}

async function addUserIdToReqIfExists(req, res, next) {    
    try {
        const token = req.headers.authorization;
        if (token) {
            const decodedToken = usersService.decodeUserJWTToken(token);
            req.userId = decodedToken.userId;
            const user = await usersService.getUserById(req.userId);
            const role = await rolesService.getRoleById(user.roleId);
            req.role = role.name;
        }
        next();
    } catch (err) {
        next(err);
    }
}

async function checkIfAdministrator(req, res, next) {    
    try {
        if (req.role !== ROLENAMES.ADMINISTARTOR) {
            throw new ApplicationError("Endpoint not permitted!", 401);
        }
        next();
    } catch (err) {
        next(err);
    }
}

async function checkIfStartup(req, res, next) {    
    try {
        if (req.role !== ROLENAMES.STARTUP) {
            throw new ApplicationError("Endpoint not permitted!", 401);
        }
        next();
    } catch (err) {
        next(err);
    }
}

async function checkIfInvestor(req, res, next) {    
    try {
        if (req.role !== ROLENAMES.INVESTOR) {
            throw new ApplicationError("Endpoint not permitted!", 401);
        }
        next();
    } catch (err) {
        next(err);
    }
}

async function checkIfInvestorOrAdministrator(req, res, next) {    
    try {
        if (req.role !== ROLENAMES.INVESTOR && req.role !== ROLENAMES.ADMINISTARTOR) {
            throw new ApplicationError("Endpoint not permitted!", 401);
        }
        next();
    } catch (err) {
        next(err);
    }
}

async function checkIfInvestorOrStartup(req, res, next) {    
    try {
        if (req.role !== ROLENAMES.INVESTOR && req.role !== ROLENAMES.STARTUP) {
            throw new ApplicationError("Endpoint not permitted!", 401);
        }
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    checkUser,
    addUserIdToReqIfExists,
    checkIfAdministrator,
    checkIfInvestor,
    checkIfStartup,
    checkIfInvestorOrAdministrator,
    checkIfInvestorOrStartup,
};
