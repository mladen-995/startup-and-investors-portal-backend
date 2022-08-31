const db = require("../models");
const { Op } = require("sequelize");
const { NOTIFADVISIBILITYTYPES } = require("../utils/consts");

async function createNotification(userId, title, text, isEmailNotification, visibility, transaction) {
    return db.Notifications.create({
        title,
        text,
        isEmailNotification,
        visibility,
        createdBy: userId,
    }, { 
        transaction: transaction,
    }); 
}

async function createNotificationVisibilityPair(notificationsId, pairId, transaction) {
    return db.NotificationVisibilityPairs.create({
        notificationsId,
        pairId,
    }, { 
        transaction: transaction,
    });
}

async function findNotificationById(id) {
    return db.Notifications.findOne({
        id,
    });
}

async function notificationDeleteRequest(id) {
    return db.Notifications.update(
        { requestedDeletion: true },
        { where: { id } },
    );
}

async function getNotificationsForDeletion() {
    return db.Notifications.findAll({
        where: {
            requestedDeletion: true,
        },
        include: {
            model: db.NotificationVisibilityPairs,
            as: "notificationsPairs",
        },
    });
}

async function deleteNotification(id) {
    return db.Notifications.destroy({
        where: {
            id,
        },
    });
}

async function getNotificationsForAuthor(authorId) {
    return db.Notifications.findAll({
        where: {
            createdBy: authorId,
            isEmailNotification: false,
        },
        include: {
            model: db.NotificationVisibilityPairs,
            as: "notificationsPairs",
        },
    });
}

async function getNotificationsForGuest() {
    return db.Notifications.findAll({
        where: {
            visibility: NOTIFADVISIBILITYTYPES.ALL.name,
            isEmailNotification: false,
        },
    });
}

async function getNotificationsForStartup(startupId, startupBusinessType) {
    // const startupGroups = startupsGroupsService.getGroupsForStartup(startup.id);
    const notifIdsFromVisibilityPairs = await db.NotificationVisibilityPairs.findAll({
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
    return db.Notifications.findAll({
        where: {
            isEmailNotification: false,
            // createdBy: {[Op.notIn]: mutedInvestorIds }
            [Op.or]: [{
                visibility: NOTIFADVISIBILITYTYPES.ALL.name,
            }, {
                visibility: NOTIFADVISIBILITYTYPES.STARTUPSONLY.name,
            }, {
                id: notifIdsFromVisibilityPairs.map(pair => pair.dataValues.notificationsId),
            }]
        },
    });
}

module.exports = {
    createNotification,
    createNotificationVisibilityPair,
    findNotificationById,
    notificationDeleteRequest,
    getNotificationsForDeletion,
    deleteNotification,
    getNotificationsForAuthor,
    getNotificationsForGuest,
    getNotificationsForStartup,
};
