const newsService = require("../services/news.service");
const rolesService = require("../services/roles.service");
const usersService = require("../services/users.service");
const categoriesService = require("../services/categories.service");
const { NEWSVISIBILITYTYPES, ROLENAMES, CATEGORYENTITITES } = require("../utils/consts");
const { ApplicationError } = require("../utils/errors");

async function createNews(userId, title, text, categoryId, visibility, visibilityPairObject, transaction) {
    if (categoryId) {
        const existingCategory = await categoriesService.getCategoryById(categoryId);
        if (!existingCategory) {
            throw new ApplicationError("Category not found!", 422);
        }
        if (existingCategory.entityName !== CATEGORYENTITITES.NEWS) {
            throw new ApplicationError("This category is for a diffrenet entity!", 422);
        }
        const currentDateTime = new Date().getTime();
        if (new Date(existingCategory.dateFrom).getTime() > currentDateTime || new Date(existingCategory.dateTo).getTime() < currentDateTime) {
            throw new ApplicationError("This category is not currently active!", 422);
        }
    }   
    const news = await newsService.createNews(userId, title, text, visibility, categoryId, transaction);
    for (const type of Object.keys(NEWSVISIBILITYTYPES)) {
        if (NEWSVISIBILITYTYPES[type].name === visibility && NEWSVISIBILITYTYPES[type].hasPair) {
            visibilityPairObject.forEach(async (pairId) => {
                await newsService.createNewsVisibilityPair(news.id, pairId, transaction);
            });
        }
    }
}

async function archiveNews(userId, newsId) {
    const news = await newsService.findNewsById(newsId);
    if (userId !== news.createdBy) {
        throw new ApplicationError("User is not the author of the news!", 401);
    }
    await newsService.archiveNews(newsId);
}

async function newsDeleteRequest(userId, newsId) {
    const news = await newsService.findNewsById(newsId);
    if (userId !== news.createdBy) {
        throw new ApplicationError("User is not the author of the news!", 401);
    }
    await newsService.newsDeleteRequest(newsId);
}


async function deleteNews(userId, id) {
    return newsService.deleteNews(userId, id);
}

async function getNews(userId, filter, pagination) {
    if (!userId) {
        delete filter.requestedDeletion;
        delete filter.isArchived;
        const news = await newsService.getNewsForGuest(filter, pagination);
        for (const signleNews of news) {
            formatNews(signleNews);
        }
        return news;
    }
    const user = await usersService.getUserById(userId);
    const role = await rolesService.getRoleById(user.roleId);
    switch (role.name) {
        case ROLENAMES.INVESTOR: {
            const news = await  newsService.getNewsForInvestor(userId, filter, pagination);
            for (const signleNews of news) {
                formatNews(signleNews);
            }
            return news;
        }
        case ROLENAMES.STARTUP: {
            const news = await  newsService.getNewsForStartup(userId, filter, pagination);
            for (const signleNews of news) {
                formatNews(signleNews);
            }
            return news;
        }
        case ROLENAMES.ADMINISTARTOR: {
            const news = await  newsService.getAllNews(filter, pagination);
            for (const signleNews of news) {
                formatNews(signleNews);
            }
            return news;
        }
    }
}

async function getSingleNews(newsId) {
    const news = await newsService.findNewsById(newsId);
    formatNews(news);
    return news;
}

function formatNews(news) {
    news.dataValues.category = news.dataValues.newsCategory.name;
    delete news.dataValues.newsCategory;
}

module.exports = {
    createNews,
    archiveNews,
    newsDeleteRequest,
    getSingleNews,
    deleteNews,
    getNews,
};
