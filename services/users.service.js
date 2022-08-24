const jwt = require("jsonwebtoken");
const db = require("../models");
const { ApplicationError } = require("../utils/errors");

async function getUserByEmail(email) {
    return db.Users.findOne({
        where: {
            email: email
        }
    });
}

async function createUser(user) {
    return db.Users.create(user);
}

async function createInvestorUserProfile(userProfile) {
    return db.InvestorUserProfiles.create(userProfile);
}

async function createStartupUserProfile(userProfile) {
    return db.StartupUserProfiles.create(userProfile);
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
    getUserByEmail,
    createUser,
    createUserJWTToken,
    decodeUserJWTToken,
    createInvestorUserProfile,
    createStartupUserProfile,
};
