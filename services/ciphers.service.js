const db = require("../models");

async function getCiphersForCipherTypeId(cipherTypeId, filter, pagination) {
    filter.cipherTypeId = cipherTypeId;
    return db.Ciphers.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    });
}

async function getCipherById(id) {
    return db.Ciphers.findOne({
        where: {
            id,
        },
    }); 
}

async function createCipher(userId, name, cipherTypeId) {
    return db.Ciphers.create({
        name,
        cipherTypeId,
        createdBy: userId,
    });
}

async function deleteCipher(id) {
    return db.Ciphers.destroy({
        where: {
            id,
        },
    });
}

async function getCipherTypeByName(name) {
    return db.CipherTypes.findOne({
        where: {
            name,
        },
    });
}

async function getCipherTypeById(id) {
    return db.CipherTypes.findOne({
        where: {
            id,
        },
    }); 
}

module.exports = {
    getCiphersForCipherTypeId,
    getCipherById,
    createCipher,
    deleteCipher,
    getCipherTypeByName,
    getCipherTypeById,
};
