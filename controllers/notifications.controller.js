const notifsService = require("../services/notifications.service");
const rolesService = require("../services/roles.service");
const usersService = require("../services/users.service");
const startupGroupService = require("../services/startup-groups.service");
const { NOTIFADVISIBILITYTYPES, ROLENAMES } = require("../utils/consts");
const { ApplicationError } = require("../utils/errors");
const { sendMail } = require("../utils/mail");

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
    if(notif.isEmailNotification) {
        let userEmailsAndIds = [];
        switch (notif.visibility) {
            case NOTIFADVISIBILITYTYPES.BUSINESSTYPE.name: {
                const users = await usersService.getStartupsByBusinessTypeId(visibilityPairObject);
                for (const user of users) {
                    userEmailsAndIds.push({
                        email: user.startupProfile.email,
                        id:  user.startupProfile.id,
                    });
                }
                break;
            }
            case NOTIFADVISIBILITYTYPES.STARTUPSONLY.name: {
                const users = await usersService.getAllStartups();
                for (const user of users) {
                    userEmailsAndIds.push({
                        email: user.startupProfile.email,
                        id:  user.startupProfile.id,
                    });
                }
                break;
            }
            case NOTIFADVISIBILITYTYPES.STARTUPGROUP.name: {
                const startupGroupPairs = await startupGroupService.getStartupGroupPairsByStartupId(visibilityPairObject);
                for (const startupGroupPair of startupGroupPairs) {
                    const user = await usersService.getUserById(startupGroupPair.startupId);
                    userEmailsAndIds.push({
                        email: user.email,
                        id:  user.id,
                    });
                }
                break;
            }
            case NOTIFADVISIBILITYTYPES.STRATUPIDS.name: {
                const users = await usersService.getAllStartupsByIds(visibilityPairObject);
                for (const user of users) {
                    userEmailsAndIds.push({
                        email: user.startupProfile.email,
                        id:  user.startupProfile.id,
                    });
                }
                break;
            }
            case NOTIFADVISIBILITYTYPES.ALL.name: {
                const startups = await usersService.getAllStartups();
                for (const user of startups) {
                    userEmailsAndIds.push({
                        email: user.startupProfile.email,
                        id:  user.startupProfile.id,
                    });
                }
                const investors = await usersService.getAllInvestors();
                for (const user of investors) {
                    userEmailsAndIds.push({
                        email: user.investorProfile.email,
                        id:  user.investorProfile.id,
                    });
                }
                break;
            }
        }

        for (const userEmailAndId of userEmailsAndIds) {
            const isUserMuted = await usersService.getInvestorMutePairsForUserAndInvestor(userEmailAndId.id, userId);
            if (!isUserMuted) {
                await sendMail(title, userEmailAndId.email, null, text);
            }
        }
    }
}

async function notificationDeleteRequest(userId, notifId) {
    const notif = await notifsService.findNotificationById(notifId);
    if (userId !== notif.createdBy) {
        throw new ApplicationError("User is not the author of the notification!", 401);
    }
    await notifsService.notificationDeleteRequest(notifId);
}

async function archiveNotification(userId, notifId) {
    const notif = await notifsService.findNotificationById(notifId);
    if (userId !== notif.createdBy) {
        throw new ApplicationError("User is not the author of the notification!", 401);
    }
    await notifsService.archiveNotification(notifId);
}

async function getNotificationsForDeletion() {
    return notifsService.getNotificationsForDeletion();
}

async function deleteNotification(userId, id) {
    return notifsService.deleteNotification(userId, id);
}

async function declineNotificationDeleteRequest(id) {
    return notifsService.declineNotificationDeleteRequest(id);
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
    declineNotificationDeleteRequest,
    archiveNotification,
};
