const db = require("../models");

async function createStartupGroup(userId, name, description, transaction) {
    return db.StartupGroups.create({
        name,
        description,
        createdBy: userId,
    }, { 
        transaction: transaction 
    }); 
}

async function createStartupGroupPair(userId, startupGroupId, startupId, transaction) {
    return db.StartupGroupPairs.create({
        startupId,
        startupGroupId,
        createdBy: userId,
    }, { 
        transaction: transaction 
    }); 
}

async function getAllStartupGroups(filter, pagination) {
    return db.StartupGroups.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
        include: {
            model: db.StartupGroupPairs,
            as: "groupStartupPairs",
        },
    });
}

async function getStartupGroupById(id) {
    return db.StartupGroups.findOne({
        where: {
            id,
        },
        include: {
            model: db.StartupGroupPairs,
            as: "startupGroupPairs",
        },
    }); 
}

async function getStartupGroupPairsByStartupId(startupId) {
    return db.StartupGroupPairs.findAll({
        where: {
            startupId,
        },
    }); 
}

async function getStartupGroupByName(name) {
    return db.StartupGroups.findOne({
        where: {
            name,
        },
    }); 
}

async function deleteStartupGroup(userId, id) {
    await db.EntityDeleteLogs.create({
        entityName: "StartupGroup",
        entityId: id,
        createdBy: userId,
    });
    return db.StartupGroups.destroy({
        where: {
            id,
        },
    });
}

module.exports = {
    createStartupGroup,
    createStartupGroupPair,
    getStartupGroupPairsByStartupId,
    getAllStartupGroups,
    getStartupGroupById,
    deleteStartupGroup,
    getStartupGroupByName,
};
