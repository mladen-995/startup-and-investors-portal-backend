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

async function deleteDiscussion(userId, id) {
    const discussionReplies = await discussionsService.getDiscussionReplies(id);
    await discussionsService.deleteDiscussion(userId, id);
    for (let discussionReply of discussionReplies) {
        await discussionReply.destroy();
    }
}

async function getDiscussion(discussionId) {
    const discussion = await discussionsService.findDiscussionById(discussionId);
    formatDiscussion(discussion);
    return discussion;
}

async function getDiscussions(userId, filter, pagination) {
    if (!userId) {
        delete filter.requestedDeletion;
        delete filter.isArchived;
        const discussions = await discussionsService.getDiscussionsForGuest(filter, pagination);
        for (const discussion of discussions) {
            formatDiscussion(discussion);
        }
        return discussions;
    }
    const user = await usersService.getUserById(userId);
    const role = await rolesService.getRoleById(user.roleId);
    switch (role.name) {
        case ROLENAMES.INVESTOR: {
            const discussions = await discussionsService.getDiscussionsForInvestor(userId, filter, pagination);
            for (const discussion of discussions) {
                formatDiscussion(discussion);
            }
            return discussions;
        }
        case ROLENAMES.STARTUP: {
            const discussions = await discussionsService.getDiscussionsForStartup(userId, filter, pagination);
            for (const discussion of discussions) {
                formatDiscussion(discussion);
            }
            return discussions;
        }
        case ROLENAMES.ADMINISTARTOR: {
            const discussions = await discussionsService.getAllDiscussions(filter, pagination);
            for (const discussion of discussions) {
                formatDiscussion(discussion);
            }
            return discussions;
        }
    }
}

function formatDiscussion(discussion) {
    discussion.dataValues.category = discussion.dataValues.discussionCategory.name;
    delete discussion.dataValues.discussionCategory;
}

module.exports = {
    createDiscussion,
    createDiscussionReply,
    discussionDeleteRequest,
    getDiscussionReplies,
    getDiscussion,
    deleteDiscussion,
    getDiscussions,
};
