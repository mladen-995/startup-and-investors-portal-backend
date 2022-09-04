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

async function getInvestors(userFilter, profileFilter, pagination, attributes) {
    userFilter.roleId = 3;
    const searchObject = {
        where: userFilter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.InvestorUserProfiles,
            as: "investorProfile",
            where: profileFilter,
        },
    };
    if (attributes) {
        searchObject.attributes = attributes;
    }
    return db.Users.findAll(searchObject);
}

async function getInvestor(id, isAdmin) {
    const searchObject = {
        where: {
            roleId: 3,
            id
        },
        include: {
            model: db.InvestorUserProfiles,
            as: "investorProfile",
        },
        attributes: {
            exclude: ["password"],
        }
    };
    if (!isAdmin) {
        searchObject.attributes.exclude.push("username");
    }
    return db.Users.findOne(searchObject);
}

async function getStartups(userFilter, profileFilter, startupFieldsFilter, pagination, attributes) {
    userFilter.roleId = 2;
    
    const searchObject = {
        where: userFilter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.StartupUserProfiles,
            as: "startupProfile",
            where: profileFilter,
            include: {
                model: db.StartupPublicFields,
                as: "startupPublicFields",
                where: startupFieldsFilter,
                attributes: {
                    exclude: ["userId", "createdAt", "updatedAt", "deletedAt"]
                }
            }
        },
    };
    if (attributes) {
        searchObject.attributes = attributes;
    }
    return db.Users.findAll(searchObject);
}

async function getStartup(id, isAdmin) {
    const searchObject = {
        where: {
            roleId: 2,
            id
        },
        include: {
            model: db.StartupUserProfiles,
            as: "startupProfile",
            include: {
                model: db.StartupPublicFields,
                as: "startupPublicFields",
                attributes: {
                    exclude: ["userId", "createdAt", "updatedAt", "deletedAt"]
                }
            }
        },
        attributes: {
            exclude: ["password"],
        }
    };
    if (!isAdmin) {
        searchObject.attributes.exclude.push("username");
    }
    return db.Users.findOne(searchObject);
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

async function createStartupUserPublicFields(userId, transaction = null) {
    return db.StartupPublicFields.create(
        { userId },
        { transaction: transaction },
        );
}

async function updateUser(user, transaction = null) {
    return db.Users.update(
        user,
        { where: { id: user.id }, transaction: transaction }
        );
}

async function setUserLastLoginAt(id) {
    return db.Users.update(
        { lastLoginAt: new Date() },
        { where: { id: id }, }
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

async function getInvestorUserProfileByBusinessTypeId(businessTypeId) {
    return db.InvestorUserProfiles.findOne({
        where: {
            businessTypeId: businessTypeId,
        }
    });
}

async function getInvestorUserProfileByCountryId(countryId) {
    return db.InvestorUserProfiles.findOne({
        where: {
            countryId: countryId,
        }
    });
}

async function getInvestorUserProfileByCityId(cityId) {
    return db.InvestorUserProfiles.findOne({
        where: {
            cityId: cityId,
        }
    });
}

async function getInvestorUserProfileByMunicipalityId(municipalityId) {
    return db.InvestorUserProfiles.findOne({
        where: {
            municipalityId: municipalityId,
        }
    });
}

async function getInvestorUserProfileByStreetId(streetId) {
    return db.InvestorUserProfiles.findOne({
        where: {
            streetId: streetId,
        }
    });
}

async function getInvestorUserProfileByStreetNumberId(streetNumberId) {
    return db.InvestorUserProfiles.findOne({
        where: {
            streetNumberId: streetNumberId,
        }
    });
}

async function getStartupUserProfileByBusinessTypeId(businessTypeId) {
    return db.StartupUserProfiles.findOne({
        where: {
            businessTypeId: businessTypeId,
        }
    });
}

async function getStartupUserProfileByAreaOfInterestId(areasOfInterestId) {
    return db.StartupUserProfiles.findOne({
        where: {
            areasOfInterestId: areasOfInterestId,
        }
    });
}

async function getStartupUserProfileByProfesionalSkillId(profesionalSkillsId) {
    return db.StartupUserProfiles.findOne({
        where: {
            profesionalSkillsId: profesionalSkillsId,
        }
    });
}

async function getStartupUserProfileByCountryId(countryId) {
    return db.StartupUserProfiles.findOne({
        where: {
            countryId: countryId,
        }
    });
}

async function getStartupUserProfileByCityId(cityId) {
    return db.StartupUserProfiles.findOne({
        where: {
            cityId: cityId,
        }
    });
}

async function getStartupUserProfileByMunicipalityId(municipalityId) {
    return db.StartupUserProfiles.findOne({
        where: {
            municipalityId: municipalityId,
        }
    });
}

async function getStartupUserProfileByStreetId(streetId) {
    return db.StartupUserProfiles.findOne({
        where: {
            streetId: streetId,
        }
    });
}

async function getStartupUserProfileByStreetNumberId(streetNumberId) {
    return db.StartupUserProfiles.findOne({
        where: {
            streetNumberId: streetNumberId,
        }
    });
}

async function getStartupPublicFields(userId) {
    return db.StartupPublicFields.findOne({
        where: {
            userId,
        }
    });
}

async function updateStartupPublicFields(startupId, startupPublicFields) {
    return db.StartupPublicFields.update(
        startupPublicFields,
        { where: { userId: startupId }}
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
    getStartupPublicFields,
    createStartupUserPublicFields,
    getUserByUsername,
    getUserByEmail,
    getUserById,
    getInvestorUserProfilByUserId,
    getStartupUserProfilByUserId,
    getInvestors,
    getInvestor,
    createUser,
    createUserJWTToken,
    decodeUserJWTToken,
    createInvestorUserProfile,
    createStartupUserProfile,
    setUserLastLoginAt,
    updateUser,
    updateStartupUserProfile,
    updateInvestorUserProfile,
    getUserAndProfile,
    getInvestorUserProfileByBusinessTypeId,
    getInvestorUserProfileByCountryId,
    getInvestorUserProfileByCityId,
    getInvestorUserProfileByMunicipalityId,
    getInvestorUserProfileByStreetId,
    getInvestorUserProfileByStreetNumberId,
    getStartupUserProfileByAreaOfInterestId,
    getStartupUserProfileByProfesionalSkillId,
    getStartupUserProfileByBusinessTypeId,
    getStartupUserProfileByCountryId,
    getStartupUserProfileByCityId,
    getStartupUserProfileByMunicipalityId,
    getStartupUserProfileByStreetId,
    getStartupUserProfileByStreetNumberId,
    updateStartupPublicFields,
    getStartups,
    getStartup,
};
