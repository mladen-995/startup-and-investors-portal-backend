const lodash = require("lodash");
const db = require("../models");
const { validationResult } = require("express-validator");
const adsController = require("../controllers/ads.controller");

async function createAd(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { title, text, expiryDate, visibility, visibilityPairObject } = req.body;
        await adsController.createAd(req.userId, title, text, expiryDate, visibility, visibilityPairObject, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function adDeleteRequest(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const adId = req.params.adId;
        await adsController.adDeleteRequest(req.userId, adId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteAd(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        // add log
        const adId = req.params.adId;
        // check if admin
        await adsController.deleteAd(adId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getAds(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["title"];
        const filter = lodash.pick(req.query, filterParams);
        const ads = await adsController.getAds(req.userId, filter, pagination);
        res.status(200).json({
            success: true,
            data: ads
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    createAd,
    adDeleteRequest,
    deleteAd,
    getAds,
};
