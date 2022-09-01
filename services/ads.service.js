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
            visibility: NOTIFADVISIBILITYTYPES.ALL.name,
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
                visibility: NOTIFADVISIBILITYTYPES.ALL.name,
            }, {
                visibility: NOTIFADVISIBILITYTYPES.STARTUPSONLY.name,
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
