const discussionsService = require("../services/discussions.service");
const rolesService = require("../services/roles.service");
const usersService = require("../services/users.service");
const categoriesService = require("../services/categories.service");
const { DISCUSSIONVISIBILITYTYPES, ROLENAMES, CATEGORYENTITITES } = require("../utils/consts");
const { ApplicationError } = require("../utils/errors");

async function createDiscussion(userId, title, text, categoryId, visibility, visibilityPairObject, transaction) {
    if (categoryId) {
        const existingCategory = await categoriesService.getCategoryById(categoryId);
        if (!existingCategory) {
            throw new ApplicationError("Category not found!", 422);
        }
        if (existingCategory.entityName !== CATEGORYENTITITES.DISCUSSIONS) {
            throw new ApplicationError("This category is for a diffrenet entity!", 422);
        }
        const currentDateTime = new Date().getTime();
        if (new Date(existingCategory.dateFrom).getTime() > currentDateTime || new Date(existingCategory.dateTo).getTime() < currentDateTime) {
            throw new ApplicationError("This category is not currently active!", 422);
        }
    }
    const discussion = await discussionsService.createDiscussion(userId, title, text, visibility, categoryId, transaction);
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

async function getDiscussionsForAuthor(id, filter, pagination) {
    return discussionsService.getDiscussionsForAuthor(id, filter, pagination);
}

async function getDiscussion(discussionId) {
    return discussionsService.findDiscussionById(discussionId);
}

async function getDiscussions(userId, filter, pagination) {
    if (!userId) {
        return discussionsService.getDiscussionsForGuest(filter, pagination);
    }
    const user = await usersService.getUserById(userId);
    const role = await rolesService.getRoleById(user.roleId);
    switch (role.name) {
        case ROLENAMES.INVESTOR: {
            return discussionsService.getDiscussionsForInvestor(userId, filter, pagination);
        }
        case ROLENAMES.STARTUP: {
            const startupProfile = await usersService.getStartupUserProfilByUserId(userId);
            return discussionsService.getDiscussionsForStartup(userId, filter, pagination);
        }
        case ROLENAMES.ADMINISTARTOR: {
            return discussionsService.getDiscussionsForDeletion(filter, pagination);
        }
    }
}

module.exports = {
    createDiscussion,
    createDiscussionReply,
    discussionDeleteRequest,
    getDiscussionsForAuthor,
    getDiscussionReplies,
    getDiscussion,
    deleteDiscussion,
    getDiscussions,
};
