const startupGroupsService = require("../services/startup-groups.service");
const { ApplicationError } = require("../utils/errors.util");

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

async function getStartupGroupsForUser(userId, filter, pagination) {
    const startupPairsForStartup = await startupGroupsService.getStartupGroupPairsByStartupId(userId);
    const groupIds = [];
    startupPairsForStartup.forEach((group) => {
        groupIds.push(group.startupGroupId);
    });
    filter.id = groupIds;
    return startupGroupsService.getAllStartupGroups(filter, pagination);
}

async function joinStartupGroup(userId, groupId) {
    const startupGroups = await startupGroupsService.getStartupGroupPairForStartupAndGroup(userId, groupId);
    if (startupGroups) {
        throw new ApplicationError("Startup already in group!", 422);
    }
    return startupGroupsService.createStartupGroupPair(userId, groupId, userId);
}

async function leaveStartupGroup(userId, groupId) {
    const startupGroups = await startupGroupsService.getStartupGroupPairForStartupAndGroup(userId, groupId);
    if (!startupGroups) {
        throw new ApplicationError("Startup isn't in group!", 422);
    }
    return startupGroupsService.deleteStartupGroupPair(userId, groupId);
}

async function deleteStartupGroup(userId, groupId) {
    const startupPairs = await startupGroupsService.getStartupGroupPairsByStartupId(userId);
    for (const pair of startupPairs) {
        await pair.destory();
    }
    return startupGroupsService.deleteStartupGroup(userId, groupId);
}

module.exports = {
    createStartupGroup,
    getStartupGroups,
    getStartupGroup,
    deleteStartupGroup,
    getStartupGroupsForUser,
    joinStartupGroup,
    leaveStartupGroup,
};
