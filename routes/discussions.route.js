const lodash = require("lodash");
const db = require("../models");
const { validationResult } = require("express-validator");
const discussionsController = require("../controllers/discussions.controller");

async function createDiscussion(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { title, text, categoryId, visibility, visibilityPairObject } = req.body;
        await discussionsController.createDiscussion(req.userId, title, text, categoryId, visibility, visibilityPairObject, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function createDiscussionReply(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { text } = req.body;
        const parentId = req.params.parentId;
        await discussionsController.createDiscussionReply(req.userId, parentId, text);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function discussionDeleteRequest(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const discussionId = req.params.discussionId;
        await discussionsController.discussionDeleteRequest(req.userId, discussionId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteDiscussion(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        // add log
        const discussionId = req.params.discussionId;
        // check if admin
        await discussionsController.deleteDiscussion(discussionId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getDiscussionsForAuthor(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["title", "categoryId"];
        const filter = lodash.pick(req.query, filterParams);
        const discussions = await discussionsController.getDiscussionsForAuthor(req.userId, filter, pagination);
        res.status(200).json({
            success: true,
            data: discussions
        });
    } catch(err) {
        next(err);
    }
}

async function getDiscussions(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["title", "categoryId", "requestedDeletion", "isArchived"];
        const filter = lodash.pick(req.query, filterParams);
        const discussions = await discussionsController.getDiscussions(req.userId, filter, pagination);
        res.status(200).json({
            success: true,
            data: discussions
        });
    } catch(err) {
        next(err);
    }
}

async function getDiscussion(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        // add log
        const discussionId = req.params.discussionId;
        // check if admin
        const discussion = await discussionsController.getDiscussion(discussionId);
        res.status(200).json({
            success: true,
            data: discussion,
        });
    } catch(err) {
        next(err);
    }
}

async function getDiscussionReplies(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const parentId = req.params.parentId;
        const discussionReplies = await discussionsController.getDiscussionReplies(parentId);
        res.status(200).json({
            success: true,
            data: discussionReplies
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    createDiscussion,
    createDiscussionReply,
    discussionDeleteRequest,
    deleteDiscussion,
    getDiscussions,
    getDiscussionsForAuthor,
    getDiscussionReplies,
    getDiscussion,
};
