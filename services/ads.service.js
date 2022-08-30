const db = require("../models");
const { Op } = require("sequelize");
const { ADVISIBILITYTYPES } = require("../utils/consts");

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

async function createAdVisibilityPair(adId, pairId) {
    return db.AdVisibilityPairs.create({
        adId,
        pairId,
    });
}

async function findAdById(id) {
    return db.Ads.findOne({
        id,
    });
}

async function adDeleteRequest(id) {
    return db.Ads.update(
        { requestedDeletion: true },
        { where: { id } },
    );
}

async function getAdsForDeletion() {
    return db.Ads.findAll({
        where: {
            requestedDeletion: true,
        },
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

async function getAdsForAuthor(authorId) {
    return db.Ads.findAll({
        where: {
            createdBy: authorId,
        },
        include: {
            model: db.AdVisibilityPairs,
            as: "adPairs",
        },
    });
}

async function getAdsForGuest() {
    return db.Ads.findAll({
        where: {
            visibility: ADVISIBILITYTYPES.ALL.name,
            expiryDate: {
                [Op.gte]: new Date(),
            }
        },
    });
}

async function getAdsForStartup(startupId, startupBusinessType) {
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
    // mutedInvestorIds get
    return db.Ads.findAll({
        where: {
            expiryDate: {
                [Op.gte]: new Date(),
            },
            // createdBy: {[Op.notIn]: mutedInvestorIds }
            [Op.or]: [{
                visibility: ADVISIBILITYTYPES.ALL.name,
            }, {
                visibility: ADVISIBILITYTYPES.STARTUPSONLY.name,
            }, {
                id: adIdsFromVisibilityPairs.map(pair => pair.dataValues.adId),
            }]
        },
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
