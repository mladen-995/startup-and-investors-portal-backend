const jwt = require("jsonwebtoken");
const db = require("../models");
const rolesService = require("./roles.service");
const { ApplicationError } = require("../utils/errors");
const { ROLENAMES } = require("../utils/consts");

async function getUserByEmail(email) {
    return db.Users.findOne({
        where: {
            email: email,
        }
    });
}

async function getUserByUsername(username) {
    return db.Users.findOne({
        where: {
            username: username,
        }
    });
}

async function getUserById(id) {
    return db.Users.findOne({
        where: {
            id: id,
        }
    });
}

async function getInvestorUserProfilByUserId(userId){
    return db.InvestorUserProfiles.findOne({
        where: {
            userId: userId,
        }
    });
}

async function getStartupUserProfilByUserId(userId){
    return db.StartupUserProfiles.findOne({
        where: {
            userId: userId,
        }
    });
    
}

async function getUserAndProfile(id){
    const user = await getUserById(id);
    delete user.dataValues.password;
    const role = await rolesService.getRoleById(user.roleId);
    switch (role.name) {
        case ROLENAMES.INVESTOR: {
            const profile = await getInvestorUserProfilByUserId(id);
            user.dataValues.profile = profile;
            break;
        }
        case ROLENAMES.STARTUP: {
            const profile = await getStartupUserProfilByUserId(id);
            user.dataValues.profile = profile.dataValues;
            break;
        }
        case ROLENAMES.ADMINISTARTOR: {
            break;
        }
    }
    return user.dataValues;
}

async function createUser(user, transaction = null) {
    return db.Users.create(user,
        { transaction: transaction },
        );
}

async function createInvestorUserProfile(userProfile, transaction = null) {
    return db.InvestorUserProfiles.create(userProfile,
        { transaction: transaction },
        );
}

async function createStartupUserProfile(userProfile, transaction = null) {
    return db.StartupUserProfiles.create(userProfile,
        { transaction: transaction },
        );
}

async function updateUser(user, transaction = null) {
    return db.Users.update(
        user,
        { where: { id: user.id }, transaction: transaction }
        );
}

async function updateStartupUserProfile(userProfile, transaction = null) {
    return db.StartupUserProfiles.update(
        userProfile,
        { where: { userId: userProfile.userId }, transaction: transaction },
        );
}

async function updateInvestorUserProfile(userProfile, transaction = null) {
    return db.InvestorUserProfiles.update(
        userProfile,
        { where: { userId: userProfile.userId }, transaction: transaction },
        );
}


function createUserJWTToken(id, username) {
    try {
        return jwt.sign(
            { userId: id, username: username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    } catch {
        throw new ApplicationError("Error signing jwt token!", 500);
    }
}

function decodeUserJWTToken(token) {
    try {
        token = token.split(' ')[1]; 
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken;
    } catch {
        throw new ApplicationError("Error decoding jwt token!", 401);
    }
}

module.exports = {
    getUserByUsername,
    getUserByEmail,
    getUserById,
    getInvestorUserProfilByUserId,
    getStartupUserProfilByUserId,
    createUser,
    createUserJWTToken,
    decodeUserJWTToken,
    createInvestorUserProfile,
    createStartupUserProfile,
    updateUser,
    updateStartupUserProfile,
    updateInvestorUserProfile,
    getUserAndProfile,
};
