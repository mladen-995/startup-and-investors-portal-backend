const notifsService = require("../services/notifications.service");
const rolesService = require("../services/roles.service");
const usersService = require("../services/users.service");
const { NOTIFADVISIBILITYTYPES, ROLENAMES } = require("../utils/consts");
const { ApplicationError } = require("../utils/errors");

async function createNotification(userId, title, text, isEmailNotification, visibility, visibilityPairObject, transaction) {
    const notif = await notifsService.createNotification(userId, title, text, isEmailNotification, visibility, transaction);
    for (const type of Object.keys(NOTIFADVISIBILITYTYPES)) {
        if (NOTIFADVISIBILITYTYPES[type].name === visibility && NOTIFADVISIBILITYTYPES[type].hasPair) {
            if (Array.isArray(visibilityPairObject)) {
                for (const pairId of visibilityPairObject) {
                    await notifsService.createNotificationVisibilityPair(notif.id, pairId, transaction);
                }
            } else {
                await notifsService.createNotificationVisibilityPair(notif.id, visibilityPairObject, transaction);
            }
        }
    }
    // send email!
}

async function notificationDeleteRequest(userId, notifId) {
    const notif = await notifsService.findNotificationById(notifId);
    if (userId !== notif.createdBy) {
        throw new ApplicationError("User is not the author of the notification!", 401);
    }
    await notifsService.notificationDeleteRequest(notifId);
}

async function getNotificationsForDeletion() {
    return notifsService.getNotificationsForDeletion();
}

async function deleteNotification(id) {
    return notifsService.deleteNotification(id);
}

async function getNotifications(userId, filter, pagination) {
    if (!userId) {
        delete filter.requestedDeletion;
        delete filter.isArchived;
        return notifsService.getNotificationsForGuest(filter, pagination);
    }
    const user = await usersService.getUserById(userId);
    const role = await rolesService.getRoleById(user.roleId);
    switch (role.name) {
        case ROLENAMES.INVESTOR: {
            return notifsService.getNotificationsForInvestor(userId, filter, pagination);
        }
        case ROLENAMES.STARTUP: {
            const startupProfile = await usersService.getStartupUserProfilByUserId(userId);
            return notifsService.getNotificationsForStartup(userId, startupProfile.businessTypeId, filter, pagination);
        }
        case ROLENAMES.ADMINISTARTOR: {
            return notifsService.getAllNotifications(filter, pagination);
        }
    }
}

async function getNotification(notificationId) {
    return notifsService.findNotificationById(notificationId);
}

module.exports = {
    createNotification,
    notificationDeleteRequest,
    getNotificationsForDeletion,
    deleteNotification,
    getNotifications,
    getNotification,
};
