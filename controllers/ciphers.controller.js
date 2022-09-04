const ciphersService = require("../services/ciphers.service");
const usersService = require("../services/users.service");
const { ROLENAMES } = require("../utils/consts");
const { ApplicationError } = require("../utils/errors");

async function getCiphers(cipherTypeName, filter, pagination) {
    const cipherType = await ciphersService.getCipherTypeByName(cipherTypeName);
    if (!cipherType) {
        throw new ApplicationError("Cipher type with that name doesn't exist!", 422);
    }
    return ciphersService.getCiphersForCipherTypeId(cipherType.id, filter, pagination);
}

async function getCipher(cipherId) {
    return ciphersService.getCipherById(cipherId);
}

async function createCipher(userId, role, name, cipherTypeName) {
    const cipherType = await ciphersService.getCipherTypeByName(cipherTypeName);
    if (!cipherType) {
        throw new ApplicationError("Cipher type with that name doesn't exist!", 422);
    }
    if (!cipherType.editableByAll && role !== ROLENAMES.ADMINISTARTOR) {
        throw new ApplicationError("Only administrators can change this cipher type!", 401);
    }
    return ciphersService.createCipher(userId, name, cipherType.id);
}

async function deleteCipher(role, cipherId) {
    let userProfile = await usersService.getInvestorUserProfileByBusinessTypeId(cipherId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByBusinessTypeId(cipherId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByAreaOfInterestId(cipherId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByProfesionalSkillId(cipherId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    const cipher = await ciphersService.getCipherById(cipherId);
    const cipherType = await ciphersService.getCipherTypeById(cipher.cipherTypeId);
    if (!cipherType.editableByAll && role !== ROLENAMES.ADMINISTARTOR) {
        throw new ApplicationError("Only administrators can change this cipher type!", 401);
    }
    return ciphersService.deleteCipher(cipherId);
}

module.exports = {
    getCiphers,
    getCipher,
    createCipher,
    deleteCipher,
};
