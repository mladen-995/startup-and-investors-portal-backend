const db = require("../models");
const { Op } = require("sequelize");

async function createCategory(userId, name, dateFrom, dateTo, entityName) {
    return db.Categories.create({
        name,
        dateFrom,
        dateTo,
        entityName,
        createdBy: userId,
    }); 
}

async function getCategoryWithName(name, entityName, dateFrom, dateTo) {
    return db.Categories.findOne({
        where: {
            name,
            entityName,
            [Op.or]: [{
                "dateFrom": {
                    [Op.between]: [dateFrom, dateTo]
                }
            }, {
                "dateTo": {
                    [Op.between]: [dateFrom, dateTo]
                }
            }],
        },
    }); 
}

async function getCategoriesForEntity(entityName, activeOnly, filter, pagination) {
    filter.entityName = entityName;
    if (activeOnly) {
        filter.dateFrom = {
            [Op.lte]: new Date(),
        };
        filter.dateTo = {
            [Op.gte]: new Date(),
        };
    }
    return db.Categories.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    }); 
}

async function getCategoryById(id) {
    return db.Categories.findOne({
        where: {
            id
        },
    }); 
}

async function deleteCategory(userId, id) {
    await db.EntityDeleteLogs.create({
        entityName: "Category",
        entityId: id,
        createdBy: userId,
    });
    return db.Categories.destroy({
        where: {
            id,
        },
    });
}

module.exports = {
    createCategory,
    getCategoryWithName,
    getCategoriesForEntity,
    getCategoryById,
    deleteCategory,
};
