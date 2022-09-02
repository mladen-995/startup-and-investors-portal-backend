const adsService = require("../services/ads.service");
const rolesService = require("../services/roles.service");
const usersService = require("../services/users.service");
const { NOTIFADVISIBILITYTYPES, ROLENAMES } = require("../utils/consts");
const { ApplicationError } = require("../utils/errors");

async function createAd(userId, title, text, expiryDate, visibility, visibilityPairObject, transaction) {
    const ad = await adsService.createAd(userId, title, text, expiryDate, visibility, transaction);
    for (const type of Object.keys(NOTIFADVISIBILITYTYPES)) {
        if (NOTIFADVISIBILITYTYPES[type].name === visibility && NOTIFADVISIBILITYTYPES[type].hasPair) {
            if (Array.isArray(visibilityPairObject)) {
                for (const pairId of visibilityPairObject) {
                    await adsService.createAdVisibilityPair(ad.id, pairId, transaction);
                }
            } else {
                await adsService.createAdVisibilityPair(ad.id, visibilityPairObject, transaction);
            }
        }
    }
}

async function adDeleteRequest(userId, adId) {
    const ad = await adsService.findAdById(adId);
    if (userId !== ad.createdBy) {
        throw new ApplicationError("User is not the author of the ad!", 401);
    }
    await adsService.adDeleteRequest(adId);
}

async function getAdsForDeletion() {
    return adsService.findAdsForDeletion();
}

async function deleteAd(id) {
    return adsService.deleteAd(id);
}

async function getAds(userId, filter, pagination) {
    if (!userId) {
        return adsService.getAdsForGuest(filter, pagination);
    }
    const user = await usersService.getUserById(userId);
    const role = await rolesService.getRoleById(user.roleId);
    switch (role.name) {
        case ROLENAMES.INVESTOR: {
            return adsService.getAdsForAuthor(userId, filter, pagination);
        }
        case ROLENAMES.STARTUP: {
            const startupProfile = await usersService.getStartupUserProfilByUserId(userId);
            return adsService.getAdsForStartup(userId, startupProfile.businessType, filter, pagination);
        }
        case ROLENAMES.ADMINISTARTOR: {
            return adsService.getAdsForDeletion(filter, pagination);
        }
    }
}

module.exports = {
    createAd,
    adDeleteRequest,
    getAdsForDeletion,
    deleteAd,
    getAds,
};
