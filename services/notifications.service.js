const db = require("../models");
const { Op } = require("sequelize");
const { NOTIFADVISIBILITYTYPES } = require("../utils/consts");
const startupGroupsService = require("./startup-groups.service");

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
        where: {
            id,
        },
    }); 
}

async function notificationDeleteRequest(id) {
    return db.Notifications.update(
        { requestedDeletion: true },
        { where: { id } },
    );
}

async function getAllNotifications(filter, pagination) {
    filter.isEmailNotification = false;
    return db.Notifications.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
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

async function getNotificationsForInvestor(investorId, filter, pagination) {
    filter.isEmailNotification = false;
    filter[Op.or] = [{
        createdBy: investorId,
    }, {
        [Op.and]: [{
                isArchived: false,
            }, {
                visibility: NOTIFADVISIBILITYTYPES.ALL.name,
            }],
    }];
    return db.Notifications.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.NotificationVisibilityPairs,
            as: "notificationsPairs",
        },
    });
}

async function getNotificationsForGuest(filter, pagination) {
    filter.visibility = NOTIFADVISIBILITYTYPES.ALL.name;
    filter.isEmailNotification = false;
    filter.isArchived = false;
    return db.Notifications.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    });
}

async function getNotificationsForStartup(startupId, startupBusinessType, filter, pagination) {
    const startupGroupPairs = startupGroupsService.getStartupGroupPairsByStartupId(startupId);
    const notifIdsFromVisibilityPairs = await db.NotificationVisibilityPairs.findAll({
        where: {
            [Op.or]: [{
                pairId: startupId,
            }
            // , {
            //     pairId: startupBusinessType,
            // } 
            , {
                pairId: startupGroupPairs.map(startupGroupPair => startupGroupPair.dataValues.startupId),
            }
        ]
        },
    });
    filter.isEmailNotification = false;
    filter[Op.or] = [{
        createdBy: startupId,
    }, {
        [Op.and]: [{
            isArchived: false,
            }, {
                [Op.or]: [{
                    visibility: NOTIFADVISIBILITYTYPES.ALL.name,
                }, {
                    visibility: NOTIFADVISIBILITYTYPES.STARTUPSONLY.name,
                }, {
                    id: notifIdsFromVisibilityPairs.map(pair => pair.dataValues.notificationsId),
                }],
            }],
    }];
    return db.Notifications.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    });
}

module.exports = {
    createNotification,
    createNotificationVisibilityPair,
    findNotificationById,
    notificationDeleteRequest,
    getAllNotifications,
    deleteNotification,
    getNotificationsForInvestor,
    getNotificationsForGuest,
    getNotificationsForStartup,
};
