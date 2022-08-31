const db = require("../models");
const { validationResult } = require("express-validator");
const notifsController = require("../controllers/notifications.controller");

async function createNotification(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { title, text, isEmailNotification, visibility, visibilityPairObject } = req.body;
        await notifsController.createNotification(req.userId, title, text, isEmailNotification, visibility, visibilityPairObject, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function notificationDeleteRequest(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const notificationId = req.params.notificationId;
        await notifsController.notificationDeleteRequest(req.userId, notificationId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteNotification(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        // add log
        const notificationId = req.params.notificationId;
        // check if admin
        await notifsController.deleteNotification(notificationId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getNotifications(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const ads = await notifsController.getNotifications(req.userId);
        res.status(200).json({
            success: true,
            data: ads
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    createNotification,
    notificationDeleteRequest,
    deleteNotification,
    getNotifications,
};
