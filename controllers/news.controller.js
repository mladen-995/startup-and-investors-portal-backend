const newsService = require("../services/news.service");
const rolesService = require("../services/roles.service");
const usersService = require("../services/users.service");
const { NEWSVISIBILITYTYPES, ROLENAMES } = require("../utils/consts");
const { ApplicationError } = require("../utils/errors");

async function createNews(userId, title, text, newsCategory, visibility, visibilityPairObject, transaction) {
    const news = await newsService.createNews(userId, title, text, newsCategory, visibility, transaction);
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


async function deleteNews(id) {
    return newsService.deleteNews(id);
}

async function getNews(userId = null) {
    if (!userId) {
        return newsService.getNewsForGuest();
    }
    const user = await usersService.getUserById(userId);
    const role = await rolesService.getRoleById(user.roleId);
    switch (role.name) {
        case ROLENAMES.INVESTOR: {
            return newsService.getNewsForInvestor(userId);
        }
        case ROLENAMES.STARTUP: {
            const startupProfile = await usersService.getStartupUserProfilByUserId(userId);
            return newsService.getNewsForStartup(userId, startupProfile.businessType);
        }
        case ROLENAMES.ADMINISTARTOR: {
            return newsService.getNewsForDeletion();
        }
    }
}

async function getNewsForAuthor(authorId) {
    return newsService.getNewsForAuthor(authorId);
}

module.exports = {
    createNews,
    archiveNews,
    newsDeleteRequest,
    deleteNews,
    getNews,
    getNewsForAuthor,
};
