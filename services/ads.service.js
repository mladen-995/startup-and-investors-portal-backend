const db = require("../models");
const { Op } = require("sequelize");
const { NOTIFADVISIBILITYTYPES } = require("../utils/consts");

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

async function getAdsForDeletion(filter, pagination) {
    filter.requestedDeletion = true;
    filter.expiryDate = {
        [Op.gte]: new Date(),
    };
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

async function deleteAd(id) {
    return db.Ads.destroy({
        where: {
            id,
        },
    });
}

async function getAdsForAuthor(authorId, filter, pagination) {
    filter.createdBy = authorId;
    filter.expiryDate = {
        [Op.gte]: new Date(),
    };
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

async function getAdsForStartup(startupId, startupBusinessType, filter, pagination) {
    // const startupGroups = startupsGroupsService.getGroupsForStartup(startup.id);
    const adIdsFromVisibilityPairs = await db.AdVisibilityPairs.findAll({
        where: {
            // [Op.or]: [{
                pairId: startupId,
            // }
            // , {
            //     pairId: startupBusinessType,
            // }, 
            // {
            //     // pairId: startupGroups,
            // }
        // ]
        },
    });
    filter.expiryDate = {
        [Op.gte]: new Date(),
    },
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
    getAdsForDeletion,
    deleteAd,
    getAdsForAuthor,
    getAdsForGuest,
    getAdsForStartup,
};
