const startupGroupsService = require("../services/startup-groups.service");
const { ApplicationError } = require("../utils/errors");

async function createStartupGroup(userId, name, description, startupIds, transaction) {
    const existingStartupGroup = await startupGroupsService.getStartupGroupByName(name);
    if (existingStartupGroup) {
        throw new ApplicationError("Startup group with this name already exists!", 422);
    }
    const startupGroup = await startupGroupsService.createStartupGroup(userId, name, description, transaction);
    for (const startupId in startupIds) {
        await startupGroupsService.createStartupGroupPair(userId, startupGroup.id, startupId, transaction);
    }
}

async function getStartupGroups(filter, pagination) {
    await startupGroupsService.getAllStartupGroups(filter, pagination);
}

async function getStartupGroup(groupId) {
    return startupGroupsService.getStartupGroupById(groupId);
}

async function deleteStartupGroup(groupId) {
    return startupGroupsService.deleteStartupGroup(groupId);
}

module.exports = {
    createStartupGroup,
    getStartupGroups,
    getStartupGroup,
    deleteStartupGroup,
};
