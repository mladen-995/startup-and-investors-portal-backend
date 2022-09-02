const db = require("../models");
const { Op } = require("sequelize");
const { DISCUSSIONVISIBILITYTYPES } = require("../utils/consts");

async function createDiscussion(userId, title, text, visibility, categoryId = null, transaction = null) {
    return db.Discussions.create({
        title,
        text,
        categoryId,
        visibility,
        createdBy: userId,
    }, { 
        transaction: transaction 
    }); 
}

async function createDiscussionVisibilityPair(discussionId, pairId, transaction) {
    return db.DiscussionVisibilityPairs.create({
        discussionId,
        pairId,
    }, { 
        transaction: transaction 
    });
}

async function createDiscussionReply(userId, parentId, text) {
    return db.DiscussionReplies.create({
        parentId,
        text,
        createdBy: userId,
    });
}

async function getDiscussionReplies(parentId) {
    return db.DiscussionReplies.findAll({
        where: {
            parentId,
        },
        order: [['createdAt', 'ASC']]
    });
}

async function findDiscussionById(id) {
    return db.Discussions.findOne({
        where: {
            id,
        },
    }); 
}

async function getDiscussionByCategoryId(categoryId) {
    return db.Discussions.findOne({
        where: {
            categoryId,
        },
    }); 
}

async function discussionDeleteRequest(id) {
    return db.Discussions.update(
        { requestedDeletion: true },
        { where: { id } },
    );
}

async function getDiscussionsForDeletion(filter, pagination) {
    filter.requestedDeletion = true;
    return db.Discussions.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.DiscussionVisibilityPairs,
            as: "discussionPairs",
        },
    }); 
}

async function deleteDiscussion(id) {
    return db.Discussions.destroy({
        where: {
            id,
        },
    });
}

async function getDiscussionsForAuthor(authorId, filter, pagination) {
    filter.createdBy = authorId;
    return db.Discussions.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.DiscussionVisibilityPairs,
            as: "discussionPairs",
        },
    }); 
}

async function getDiscussionsForGuest(filter, pagination) {
    filter.visibility = DISCUSSIONVISIBILITYTYPES.ALL.name;
    filter.isArchived = false;
    return db.Discussions.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    }); 
}

async function getDiscussionsForStartup(startupId, filter, pagination) {
    const discussionIdsFromVisibilityPairs = await db.DiscussionVisibilityPairs.findAll({
        where: {
            pairId: startupId,
        },
    });
    filter.isArchived = false;
    filter[Op.or] = [{
                visibility: DISCUSSIONVISIBILITYTYPES.ALL.name,
            }, {
                visibility: DISCUSSIONVISIBILITYTYPES.STARTUPSONLY.name,
            }, {
                id: discussionIdsFromVisibilityPairs.map(pair => pair.dataValues.discussionId),
    }];
    // mutedInvestorIds get
    // createdBy: {[Op.notIn]: mutedInvestorIds }
    return db.Discussions.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    });
}

async function getDiscussionsForInvestor(investorId, filter, pagination) {
    const discussionIdsFromVisibilityPairs = await db.DiscussionVisibilityPairs.findAll({
        where: {
            pairId: investorId,
        },
    });
    filter.isArchived = false;
    filter[Op.or] = [{
        visibility: DISCUSSIONVISIBILITYTYPES.ALL.name,
    }, {
        id: discussionIdsFromVisibilityPairs.map(pair => pair.dataValues.discussionId),
    }];
    return db.Discussions.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    }); 
}

module.exports = {
    createDiscussion,
    createDiscussionVisibilityPair,
    createDiscussionReply,
    findDiscussionById,
    discussionDeleteRequest,
    getDiscussionsForDeletion,
    deleteDiscussion,
    getDiscussionsForAuthor,
    getDiscussionsForGuest,
    getDiscussionsForStartup,
    getDiscussionsForInvestor,
    getDiscussionReplies,
    getDiscussionByCategoryId,
};
