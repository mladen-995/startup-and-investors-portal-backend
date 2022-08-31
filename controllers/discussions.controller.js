const discussionsService = require("../services/discussions.service");
const rolesService = require("../services/roles.service");
const usersService = require("../services/users.service");
const { DISCUSSIONVISIBILITYTYPES, ROLENAMES } = require("../utils/consts");
const { ApplicationError } = require("../utils/errors");

async function createDiscussion(userId, title, text, discussionCategory, visibility, visibilityPairObject, transaction) {
    const discussion = await discussionsService.createDiscussion(userId, title, text, discussionCategory, visibility, transaction);
    for (const type of Object.keys(DISCUSSIONVISIBILITYTYPES)) {
        if (DISCUSSIONVISIBILITYTYPES[type].name === visibility && DISCUSSIONVISIBILITYTYPES[type].hasPair) {
            for (const pairId of visibilityPairObject) {
                await discussionsService.createDiscussionVisibilityPair(discussion.id, pairId, transaction);
            }
        }
    }
}

async function createDiscussionReply(userId, parentId, text) {
    const parent = await discussionsService.findDiscussionById(parentId);
    if (!parent) {
        throw new ApplicationError("Parent discussion doesn't exist!", 422);
    }
    await discussionsService.createDiscussionReply(userId, parentId, text);
}

async function getDiscussionReplies(parentId) {
    // proveri moze li da vidi original i da li je original arhiviran
    return discussionsService.getDiscussionReplies(parentId);
}

async function discussionDeleteRequest(userId, discussionId) {
    const discussion = await discussionsService.findDiscussionById(discussionId);
    if (userId !== discussion.createdBy) {
        throw new ApplicationError("User is not the author of the discussion!", 401);
    }
    await discussionsService.discussionDeleteRequest(discussionId);
}

async function deleteDiscussion(id) {
    return discussionsService.deleteDiscussion(id);
}

async function getDiscussionsForAuthor(id) {
    return discussionsService.getDiscussionsForAuthor(id);
}

async function getDiscussions(userId = null) {
    if (!userId) {
        return discussionsService.getDiscussionsForGuest();
    }
    const user = await usersService.getUserById(userId);
    const role = await rolesService.getRoleById(user.roleId);
    switch (role.name) {
        case ROLENAMES.INVESTOR: {
            return discussionsService.getDiscussionsForInvestor(userId);
        }
        case ROLENAMES.STARTUP: {
            const startupProfile = await usersService.getStartupUserProfilByUserId(userId);
            return discussionsService.getDiscussionsForStartup(userId, startupProfile.businessType);
        }
        case ROLENAMES.ADMINISTARTOR: {
            return discussionsService.getDiscussionsForDeletion();
        }
    }
}

module.exports = {
    createDiscussion,
    createDiscussionReply,
    discussionDeleteRequest,
    getDiscussionsForAuthor,
    getDiscussionReplies,
    deleteDiscussion,
    getDiscussions,
};
