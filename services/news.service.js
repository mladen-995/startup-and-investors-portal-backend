const db = require("../models");
const { Op } = require("sequelize");
const { NEWSVISIBILITYTYPES } = require("../utils/consts.util");

async function createNews(userId, title, text, visibility, categoryId = null, transaction = null) {
    return db.News.create({
        title,
        text,
        categoryId,
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
        where: {
            id,
        },
        include: {
            model: db.Categories,
            as: "newsCategory",
        },
    }); 
}

async function getNewsByCategoryId(categoryId) {
    return db.News.findOne({
        where: {
            categoryId,
        },
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

async function declineNewsDeleteRequest(id) {
    return db.News.update(
        { requestedDeletion: false },
        { where: { id } },
    );
}

async function deleteNews(userId, id) {
    await db.EntityDeleteLogs.create({
        entityName: "News",
        entityId: id,
        createdBy: userId,
    });
    return db.News.destroy({
        where: {
            id,
        },
    });
}

async function getNewsForGuest(filter, pagination) {
    filter.isArchived = false;
    filter.visibility = NEWSVISIBILITYTYPES.ALL.name;
    return db.News.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.Categories,
            as: "newsCategory",
        },
    });
}

async function getNewsForStartup(startupId, filter, pagination) {
    const newsIdsFromVisibilityPairs = await db.NewsVisibilityPairs.findAll({
        where: {
            pairId: startupId,
        },
    });
    filter[Op.or] = [{
        createdBy: startupId,
    }, {
        [Op.and]: [{
            isArchived: false,
            }, {
                [Op.or]: [{
                    visibility: NEWSVISIBILITYTYPES.ALL.name,
                }, {
                    visibility: NEWSVISIBILITYTYPES.STARTUPSONLY.name,
                }, {
                    id: newsIdsFromVisibilityPairs.map(pair => pair.dataValues.newsId),
                }]
            }],
    }];
    return db.News.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.Categories,
            as: "newsCategory",
        },
    });
}

async function getNewsForInvestor(investorId, filter, pagination) {
    const newsIdsFromVisibilityPairs = await db.NewsVisibilityPairs.findAll({
        where: {
            pairId: investorId,
        },
    });
    filter[Op.or] = [{
        createdBy: investorId,
    }, {
        [Op.and]: [{
            isArchived: false,
            }, {
                [Op.or]: [{
                    visibility: NEWSVISIBILITYTYPES.ALL.name,
                }, {
                    visibility: NEWSVISIBILITYTYPES.INVESTORSONLY.name,
                }, {
                    id: newsIdsFromVisibilityPairs.map(pair => pair.dataValues.newsId),
                }]
            }],
    }];
    return db.News.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.Categories,
            as: "newsCategory",
        },
    });
}

async function getAllNews(filter, pagination) {
    return db.News.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: [{
            model: db.NewsVisibilityPairs,
            as: "newsPairs",
        }, {
            model: db.Categories,
            as: "newsCategory",
        }],
    });
}

async function getNewsCreatedInTimePeriodCount(dateFrom, dateTo){
    return db.News.count({
        where: {
            createdAt: {
                [Op.between]: [dateFrom, dateTo],
            },
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
    getAllNews,
    getNewsByCategoryId,
    declineNewsDeleteRequest,
    getNewsCreatedInTimePeriodCount,
};
