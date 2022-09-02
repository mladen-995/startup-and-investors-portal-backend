const categoriesService = require("../services/categories.service");
const newsService = require("../services/news.service");
const discussionsService = require("../services/discussions.service");
const { ApplicationError } = require("../utils/errors");

async function createCategory(userId, name, dateFrom, dateTo, entityName) {
    const existingCategory = await categoriesService.getCategoryWithName(name, entityName, dateFrom, dateTo);
    if (existingCategory) {
        throw new ApplicationError("There is already a category with that name in the time period!", 422);
    }
    await categoriesService.createCategory(userId, name, dateFrom, dateTo, entityName);
}

async function getCategories(entityName, activeOnly, filter, pagination) {
    return categoriesService.getCategoriesForEntity(entityName, activeOnly, filter, pagination);
}

async function getCategoryById(id) {
    return categoriesService.getCategoryById(id);
}

async function deleteCategory(id) {
    const existingNews = await newsService.getNewsByCategoryId(id);
    const existingDiscussion = await discussionsService.getDiscussionByCategoryId(id);
    if (existingDiscussion || existingNews) {
        throw new ApplicationError("Cannot delete category because it is inside an entity!", 422);
    }
    return categoriesService.deleteCategory(id);
}

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    deleteCategory,
};
