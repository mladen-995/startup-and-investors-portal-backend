const jwt = require("jsonwebtoken");
const db = require("../models");
const { Op } = require("sequelize");
const rolesService = require("./roles.service");
const { ApplicationError } = require("../utils/errors.util");
const { ROLENAMES } = require("../utils/consts.util");

async function getUserByEmail(email) {
    return db.Users.findOne({
        where: {
            email: email,
        }
    });
}

async function createResetPasswordToken(userId, token) {
    return db.Tokens.create({
        token,
        userId,
    });
}

async function getTokenByToken(token) {
    return db.Tokens.findOne({
            where: { token }, 
        }, 
    );
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
            include: [{
                model: db.StreetNumbers,
                as: "streetNumberInvestorUserProfiles"
            }, {
                model: db.Streets,
                as: "streetInvestorUserProfiles",
            }, {
                model: db.Municipalities,
                as: "municipalityInvestorUserProfiles",
            }, {
                model: db.Cities,
                as: "cityInvestorUserProfiles",
            }, {
                model: db.Countries,
                as: "countryInvestorUserProfiles",
            }, {
                model: db.Ciphers,
                as: "businessTypesInvestors",
            }]
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
            include: [{
                model: db.StreetNumbers,
                as: "streetNumberInvestorUserProfiles"
            }, {
                model: db.Streets,
                as: "streetInvestorUserProfiles",
            }, {
                model: db.Municipalities,
                as: "municipalityInvestorUserProfiles",
            }, {
                model: db.Cities,
                as: "cityInvestorUserProfiles",
            }, {
                model: db.Countries,
                as: "countryInvestorUserProfiles",
            }, {
                model: db.Ciphers,
                as: "businessTypesInvestors",
            }]
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
            include: [{
                model: db.StartupPublicFields,
                as: "startupPublicFields",
                where: startupFieldsFilter,
                attributes: {
                    exclude: ["userId", "createdAt", "updatedAt", "deletedAt"]
                }
            }, {
                model: db.StreetNumbers,
                as: "streetNumberStartupUserProfiles"
            }, {
                model: db.Streets,
                as: "streetStartupUserProfiles",
            }, {
                model: db.Municipalities,
                as: "municipalityStartupUserProfiles",
            }, {
                model: db.Cities,
                as: "cityStartupUserProfiles",
            }, {
                model: db.Countries,
                as: "countryStartupUserProfiles",
            }, {
                model: db.Ciphers,
                as: "businessTypesStartups",
            }, {
                model: db.Ciphers,
                as: "areasOfInterestsStartups",
            }, {
                model: db.Ciphers,
                as: "profesionalSkillsStartups",
            }]
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
            include: [{
                model: db.StartupPublicFields,
                as: "startupPublicFields",
                attributes: {
                    exclude: ["userId", "createdAt", "updatedAt", "deletedAt"]
                }
            }, {
                model: db.StreetNumbers,
                as: "streetNumberStartupUserProfiles"
            }, {
                model: db.Streets,
                as: "streetStartupUserProfiles",
            }, {
                model: db.Municipalities,
                as: "municipalityStartupUserProfiles",
            }, {
                model: db.Cities,
                as: "cityStartupUserProfiles",
            }, {
                model: db.Countries,
                as: "countryStartupUserProfiles",
            }, {
                model: db.Ciphers,
                as: "businessTypesStartups",
            }, {
                model: db.Ciphers,
                as: "areasOfInterestsStartups",
            }, {
                model: db.Ciphers,
                as: "profesionalSkillsStartups",
            }]
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
        },
        include: [{
            model: db.StreetNumbers,
            as: "streetNumberInvestorUserProfiles"
        }, {
            model: db.Streets,
            as: "streetInvestorUserProfiles",
        }, {
            model: db.Municipalities,
            as: "municipalityInvestorUserProfiles",
        }, {
            model: db.Cities,
            as: "cityInvestorUserProfiles",
        }, {
            model: db.Countries,
            as: "countryInvestorUserProfiles",
        }, {
            model: db.Ciphers,
            as: "businessTypesInvestors",
        }]
    });
}

async function getStartupUserProfilByUserId(userId){
    return db.StartupUserProfiles.findOne({
        where: {
            userId: userId,
        },
        include: [{
            model: db.StreetNumbers,
            as: "streetNumberStartupUserProfiles"
        }, {
            model: db.Streets,
            as: "streetStartupUserProfiles",
        }, {
            model: db.Municipalities,
            as: "municipalityStartupUserProfiles",
        }, {
            model: db.Cities,
            as: "cityStartupUserProfiles",
        }, {
            model: db.Countries,
            as: "countryStartupUserProfiles",
        }, {
            model: db.Ciphers,
            as: "businessTypesStartups",
        }, {
            model: db.Ciphers,
            as: "areasOfInterestsStartups",
        }, {
            model: db.Ciphers,
            as: "profesionalSkillsStartups",
        }]
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
            user.dataValues.profile = profile;
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

async function findOrCreateUserCreationRequest(userId, transaction = null) {
    return db.UserCreationRequests.findOrCreate({
        where: { userId },
        transaction: transaction,
    });
}

async function getUserCreationRequests() {
    return db.UserCreationRequests.findAll({
        include: {
            model: db.Users,
            as: "userCreationRequest",
        },
    });
}

async function getUserCreationRequestById(id){
    return db.UserCreationRequests.findOne({
        where: {
            id,
        }
    });
}

async function approveUser(id, transaction){
    return db.Users.update({
        approved: true,
        approvedDate: new Date()
    },
    { where: { id: id }, transaction: transaction },
    );
}

async function deleteUserCreationRequest(id, transaction){
    return db.UserCreationRequests.destroy({
        where: {
            id,
        },
        transaction: transaction,
    });
}

async function findOrCreateInvestorSearchRequest(userId, transaction = null) {
    return db.InvestorSearchStartupRequest.findOrCreate({
        where: { userId },
        transaction: transaction,
    });
}

async function getInvestorSearchRequestByUserId(userId) {
    return db.InvestorSearchStartupRequest.findOne({
        where: { userId },
    });
}


async function getInvestorSearchRequests() {
    return db.InvestorSearchStartupRequest.findAll();
}

async function getInvestorSearchRequestById(id){
    return db.InvestorSearchStartupRequest.findOne({
        where: {
            id,
        }
    });
}

async function approveInvestorSearchRequest(id, transaction){
    return db.InvestorUserProfiles.update({
        canSearchStartups: true,
    },
    { where: { userId: id }, transaction: transaction },
    );
}

async function deleteInvestorSearchRequest(id, transaction){
    return db.InvestorSearchStartupRequest.destroy({
        where: {
            id,
        },
        transaction: transaction,
    });
}

async function findOrCreateInvestorMutePair(userId, investorId){
    return db.InvestorMutePairs.findOrCreate({
        where: { 
            userId,
            investorId,
         },
    });
}

async function deleteInvestorMutePair(userId, investorId){
    return db.InvestorMutePairs.destroy({
        where: {
            userId,
            investorId,
        },
    });
}

async function getInvestorMutePairs(userId){
    return db.InvestorMutePairs.findAll({
        where: {
            userId,
        },
    });
}

async function getInvestorMutePairsForUserAndInvestor(userId, investorId){
    return db.InvestorMutePairs.findOne({
        where: {
            userId,
            investorId,
        },
    });
}

async function getUsersCreatedInTimePeriodCount(dateFrom, dateTo){
    return db.Users.count({
        where: {
            createdAt: {
                [Op.between]: [dateFrom, dateTo],
            },
        },
    });
}

async function getAllStartupsByIds(ids) {
    return db.StartupUserProfiles.findAll({
        where: {
            userId: ids,
        },
        include: {
            model: db.Users,
            as: "startupProfile",
        },
    });
}

async function getAllStartups() {
    return db.StartupUserProfiles.findAll({
        include: {
            model: db.Users,
            as: "startupProfile",
        },
    });
}

async function getAllInvestors() {
    return db.InvestorUserProfiles.findAll({
        include: {
            model: db.Users,
            as: "investorProfile",
        },
    });
}

async function getStartupsByBusinessTypeId(businessTypeId) {
    return db.StartupUserProfiles.findAll({
        where: {
            businessTypeId: businessTypeId,
        },
        include: {
            model: db.Users,
            as: "startupProfile",
        },
    });
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
    findOrCreateUserCreationRequest,
    getUserCreationRequests,
    getUserCreationRequestById,
    approveUser,
    deleteUserCreationRequest,
    findOrCreateInvestorSearchRequest,
    getInvestorSearchRequests,
    getInvestorSearchRequestById,
    approveInvestorSearchRequest,
    deleteInvestorSearchRequest,
    findOrCreateInvestorMutePair,
    deleteInvestorMutePair,
    getInvestorMutePairs,
    createResetPasswordToken,
    getTokenByToken,
    getInvestorSearchRequestByUserId,
    getUsersCreatedInTimePeriodCount,
    getAllStartups,
    getAllInvestors,
    getStartupsByBusinessTypeId,
    getAllStartupsByIds,
    getInvestorMutePairsForUserAndInvestor,
};
