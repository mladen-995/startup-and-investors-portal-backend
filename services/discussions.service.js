const db = require("../models");
const { Op } = require("sequelize");
const { DISCUSSIONVISIBILITYTYPES } = require("../utils/consts");

async function createDiscussion(userId, title, text, discussionCategory, visibility, transaction) {
    return db.Discussions.create({
        title,
        text,
        discussionCategory,
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
        id,
    });
}

async function discussionDeleteRequest(id) {
    return db.Discussions.update(
        { requestedDeletion: true },
        { where: { id } },
    );
}

async function getDiscussionsForDeletion() {
    return db.Discussions.findAll({
        where: {
            requestedDeletion: true,
        },
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

async function getDiscussionsForAuthor(authorId) {
    return db.Discussions.findAll({
        where: {
            createdBy: authorId,
        },
        include: {
            model: db.DiscussionVisibilityPairs,
            as: "discussionPairs",
        },
    });
}

async function getDiscussionsForGuest() {
    return db.Discussions.findAll({
        where: {
            visibility: DISCUSSIONVISIBILITYTYPES.ALL.name,
            isArchived: false,
        },
    });
}

async function getDiscussionsForStartup(startupId) {
    const discussionIdsFromVisibilityPairs = await db.DiscussionVisibilityPairs.findAll({
        where: {
            pairId: startupId,
        },
    });
    // mutedInvestorIds get
    return db.Discussions.findAll({
        where: {
            isArchived: false,
            // createdBy: {[Op.notIn]: mutedInvestorIds }
            [Op.or]: [{
                visibility: DISCUSSIONVISIBILITYTYPES.ALL.name,
            }, {
                visibility: DISCUSSIONVISIBILITYTYPES.STARTUPSONLY.name,
            }, {
                id: discussionIdsFromVisibilityPairs.map(pair => pair.dataValues.discussionId),
            }]
        },
    });
}

async function getDiscussionsForInvestor(startupId) {
    const discussionIdsFromVisibilityPairs = await db.DiscussionVisibilityPairs.findAll({
        where: {
            pairId: startupId,
        },
    });
    // mutedInvestorIds get
    return db.Discussions.findAll({
        where: {
            isArchived: false,
            // createdBy: {[Op.notIn]: mutedInvestorIds }
            [Op.or]: [{
                visibility: DISCUSSIONVISIBILITYTYPES.ALL.name,
            }, {
                id: discussionIdsFromVisibilityPairs.map(pair => pair.dataValues.discussionId),
            }]
        },
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
};
