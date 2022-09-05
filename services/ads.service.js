const db = require("../models");
const { Op } = require("sequelize");
const { NOTIFADVISIBILITYTYPES } = require("../utils/consts");
const startupGroupsService = require("../services/startup-groups.service");
const usersService = require("../services/users.service");

async function createAd(userId, title, text, expiryDate, visibility, transaction) {
    return db.Ads.create({
        title,
        text,
        expiryDate,
        visibility,
        createdBy: userId,
    }, { 
        transaction: transaction 
    }); 
}

async function createAdVisibilityPair(adId, pairId, transaction) {
    return db.AdVisibilityPairs.create({
        adId,
        pairId,
    }, { 
        transaction: transaction 
    });
}

async function findAdById(id) {
    return db.Ads.findOne({
        where: {
            id,
        },
    }); 
}

async function adDeleteRequest(id) {
    return db.Ads.update(
        { requestedDeletion: true },
        { where: { id } },
    );
}

async function getAllAds(filter, pagination) {
    return db.Ads.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.AdVisibilityPairs,
            as: "adPairs",
        },
    });
}

async function deleteAd(userId, id) {
    await db.EntityDeleteLogs.create({
        entityName: "Ad",
        entityId: id,
        createdBy: userId,
    });
    return db.Ads.destroy({
        where: {
            id,
        },
    });
}

async function getAdsForInvestor(authorId, filter, pagination) {
    const mutedInvestorPairs = await usersService.getInvestorMutePairs(authorId);
    filter.createdBy = {[Op.notIn]: mutedInvestorPairs.map(mutedInvestorPair => mutedInvestorPair.dataValues.investorId) };
    filter[Op.or] = [{
        createdBy: authorId,
    }, {
        [Op.and]: [{
                visibility: NOTIFADVISIBILITYTYPES.ALL.name,
            }, {
                expiryDate: {
                    [Op.gte]: new Date(),
                },
            }],
    }];
    return db.Ads.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.AdVisibilityPairs,
            as: "adPairs",
        },
    });
}

async function getAdsForGuest(filter, pagination) {
    filter.visibility = NOTIFADVISIBILITYTYPES.ALL.name;
    filter.expiryDate = {
        [Op.gte]: new Date(),
    };
    return db.Ads.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    });
}

async function getAdsForStartup(startupId, startupBusinessTypeId, filter, pagination) {
    const mutedInvestorPairs = await usersService.getInvestorMutePairs(startupId);
    const startupGroupPairs = await startupGroupsService.getStartupGroupPairsByStartupId(startupId);
    const adIdsFromVisibilityPairs = await db.AdVisibilityPairs.findAll({
        where: {
            [Op.or]: [{
                pairId: startupId,
            }, {
                pairId: startupBusinessTypeId,
            }, {
                pairId: startupGroupPairs.map(startupGroupPair => startupGroupPair.dataValues.startupId),
            }
        ]
        },
    });
    filter.expiryDate = {
        [Op.gte]: new Date(),
    },
    filter.createdBy = {[Op.notIn]: mutedInvestorPairs.map(mutedInvestorPair => mutedInvestorPair.dataValues.investorId) };
    filter[Op.or] = [{
        visibility: NOTIFADVISIBILITYTYPES.ALL.name,
    }, {
        visibility: NOTIFADVISIBILITYTYPES.STARTUPSONLY.name,
    }, {
        id: adIdsFromVisibilityPairs.map(pair => pair.dataValues.adId),
    }];
    return db.Ads.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    });
}

module.exports = {
    createAd,
    createAdVisibilityPair,
    findAdById,
    adDeleteRequest,
    getAllAds,
    deleteAd,
    getAdsForInvestor,
    getAdsForGuest,
    getAdsForStartup,
};
