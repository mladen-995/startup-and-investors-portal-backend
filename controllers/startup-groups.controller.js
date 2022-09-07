const startupGroupsService = require("../services/startup-groups.service");
const { ApplicationError } = require("../utils/errors");

async function createStartupGroup(userId, name, description, startupIds, transaction) {
    const existingStartupGroup = await startupGroupsService.getStartupGroupByName(name);
    if (existingStartupGroup) {
        throw new ApplicationError("Startup group with this name already exists!", 422);
    }
    const startupGroup = await startupGroupsService.createStartupGroup(userId, name, description, transaction);
    for (const startupId of startupIds) {
        await startupGroupsService.createStartupGroupPair(userId, startupGroup.id, startupId, transaction);
    }
}

async function getStartupGroups(filter, pagination) {
    return await startupGroupsService.getAllStartupGroups(filter, pagination);
}

async function getStartupGroup(groupId) {
    return startupGroupsService.getStartupGroupById(groupId);
}

async function deleteStartupGroup(userId, groupId) {
    return startupGroupsService.deleteStartupGroup(userId, groupId);
}

module.exports = {
    createStartupGroup,
    getStartupGroups,
    getStartupGroup,
    deleteStartupGroup,
};
