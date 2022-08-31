const db = require("../models");
const { validationResult } = require("express-validator");
const newsController = require("../controllers/news.controller");

async function createNews(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { title, text, newsCategory, visibility, visibilityPairObject } = req.body;
        await newsController.createNews(req.userId, title, text, newsCategory, visibility, visibilityPairObject, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function archiveNews(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const newsId = req.params.newsId;
        await newsController.archiveNews(req.userId, newsId);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function newsDeleteRequest(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const newsId = req.params.newsId;
        await newsController.newsDeleteRequest(req.userId, newsId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteNews(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        // add log
        const newsId = req.params.newsId;
        // check if admin
        await newsController.deleteNews(newsId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getNews(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const news = await newsController.getNews(req.userId);
        res.status(200).json({
            success: true,
            data: news
        });
    } catch(err) {
        next(err);
    }
}

async function getNewsForAuthor(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const news = await newsController.getNewsForAuthor(req.userId);
        res.status(200).json({
            success: true,
            data: news
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    createNews,
    archiveNews,
    newsDeleteRequest,
    deleteNews,
    getNews,
    getNewsForAuthor,
};
