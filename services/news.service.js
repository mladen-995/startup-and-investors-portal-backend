const db = require("../models");
const { Op } = require("sequelize");
const { NEWSVISIBILITYTYPES } = require("../utils/consts");

async function createNews(userId, title, text, newsCategory, visibility, transaction) {
    return db.News.create({
        title,
        text,
        newsCategory,
        visibility,
        createdBy: userId,
    }, { 
        transaction: transaction 
    }); 
}

async function createNewsVisibilityPair(newsId, pairId, transaction) {
    return db.NewsVisibilityPairs.create({
        newsId,
        pairId,
    }, { 
        transaction: transaction 
    });
}

async function findNewsById(id) {
    return db.News.findOne({
        id,
    });
}

async function archiveNews(id) {
    return db.News.update(
        { isArchived: true },
        { where: { id } },
    );
}

async function newsDeleteRequest(id) {
    return db.News.update(
        { requestedDeletion: true },
        { where: { id } },
    );
}

async function deleteNews(id) {
    return db.News.destroy({
        where: {
            id,
        },
    });
}

async function getNewsForGuest() {
    return db.News.findAll({
        where: {
            visibility: NEWSVISIBILITYTYPES.ALL.name,
            isArchived: false
        },
    });
}

async function getNewsForStartup(startupId) {
    const newsIdsFromVisibilityPairs = await db.NewsVisibilityPairs.findAll({
        where: {
            pairId: startupId,
        },
    });
    return db.News.findAll({
        where: {
            isArchived: false,
            // createdBy: {[Op.notIn]: mutedInvestorIds }
            [Op.or]: [{
                visibility: NEWSVISIBILITYTYPES.ALL.name,
            }, {
                visibility: NEWSVISIBILITYTYPES.STARTUPSONLY.name,
            }, {
                id: newsIdsFromVisibilityPairs.map(pair => pair.dataValues.newsId),
            }]
        },
    });
}

async function getNewsForInvestor(investorId) {
    const newsIdsFromVisibilityPairs = await db.NewsVisibilityPairs.findAll({
        where: {
            pairId: investorId,
        },
    });
    return db.News.findAll({
        where: {
            isArchived: false,
            [Op.or]: [{
                visibility: NEWSVISIBILITYTYPES.ALL.name,
            }, {
                visibility: NEWSVISIBILITYTYPES.INVESTORSONLY.name,
            }, {
                id: newsIdsFromVisibilityPairs.map(pair => pair.dataValues.newsId),
            }]
        },
    });
}

async function getNewsForDeletion() {
    return db.News.findAll({
        where: {
            requestedDeletion: true,
        },
        include: {
            model: db.NewsVisibilityPairs,
            as: "newsPairs",
        },
    });
}

async function getNewsForAuthor(authorId) {
    return db.News.findAll({
        where: {
            createdBy: authorId,
        },
        include: {
            model: db.NewsVisibilityPairs,
            as: "newsPairs",
        },
    });
}

module.exports = {
    createNews,
    createNewsVisibilityPair,
    findNewsById,
    archiveNews,
    newsDeleteRequest,
    deleteNews,
    getNewsForGuest,
    getNewsForInvestor,
    getNewsForStartup,
    getNewsForDeletion,
    getNewsForAuthor,
};
