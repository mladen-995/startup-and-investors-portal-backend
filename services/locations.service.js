const db = require("../models");

async function getAllCountries(filter, pagination) {
    return db.Countries.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    });
}

async function getCountryById(id) {
    return db.Countries.findOne({
        where: {
            id,
        },
    }); 
}

async function createCountry(userId, name) {
    return db.Countries.create({
        name,
        createdBy: userId,
    });
}

async function deleteCountry(userId, id) {
    await db.EntityDeleteLogs.create({
        entityName: "Country",
        entityId: id,
        createdBy: userId,
    });
    return db.Countries.destroy({
        where: {
            id,
        },
    });
}

async function getCitiesByCountryId(countryId, filter, pagination) {
    filter.countryId = countryId;
    return db.Cities.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    });
}

async function getCityById(id) {
    return db.Cities.findOne({
        where: {
            id,
        },
    }); 
}

async function createCity(userId, name, countryId) {
    return db.Cities.create({
        name,
        countryId,
        createdBy: userId,
    });
}

async function deleteCity(userId, id) {
    await db.EntityDeleteLogs.create({
        entityName: "City",
        entityId: id,
        createdBy: userId,
    });
    return db.Cities.destroy({
        where: {
            id,
        },
    });
}

async function getMunicipalitiesByCityId(cityId, filter, pagination) {
    filter.cityId = cityId;
    return db.Municipalities.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    });
}

async function getMunicipalitiesId(id) {
    return db.Municipalities.findOne({
        where: {
            id,
        },
    }); 
}

async function createMunicipality(userId, name, cityId) {
    return db.Municipalities.create({
        name,
        cityId,
        createdBy: userId,
    });
}

async function deleteMunicipality(userId, id) {
    await db.EntityDeleteLogs.create({
        entityName: "Municipality",
        entityId: id,
        createdBy: userId,
    });
    return db.Municipalities.destroy({
        where: {
            id,
        },
    });
}

async function getStreetsByMunicipalityId(municipalityId, filter, pagination) {
    filter.municipalityId = municipalityId;
    return db.Streets.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    });
}

async function getStreetById(id) {
    return db.Streets.findOne({
        where: {
            id,
        },
    }); 
}

async function createStreet(userId, name, municipalityId) {
    return db.Streets.create({
        name,
        municipalityId,
        createdBy: userId,
    });
}

async function deleteStreet(userId, id) {
    await db.EntityDeleteLogs.create({
        entityName: "Street",
        entityId: id,
        createdBy: userId,
    });
    return db.Streets.destroy({
        where: {
            id,
        },
    });
}

async function getStreetNumbersByStreetId(streetId, filter, pagination) {
    filter.streetId = streetId;
    return db.StreetNumbers.findAll({
        where: filter,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [[pagination.orderBy, pagination.direction]],
    });
}

async function getStreetNumberById(id) {
    return db.StreetNumbers.findOne({
        where: {
            id,
        },
    }); 
}

async function createStreetNumber(userId, name, streetId) {
    return db.StreetNumbers.create({
        name,
        streetId,
        createdBy: userId,
    });
}

async function deleteStreetNumber(userId, id) {
    await db.EntityDeleteLogs.create({
        entityName: "StreetNumber",
        entityId: id,
        createdBy: userId,
    });
    return db.StreetNumbers.destroy({
        where: {
            id,
        },
    });
}

module.exports = {
    getAllCountries,
    getCountryById,
    createCountry,
    deleteCountry,
    getCitiesByCountryId,
    getCityById,
    createCity,
    deleteCity,
    getMunicipalitiesByCityId,
    getMunicipalitiesId,
    createMunicipality,
    deleteMunicipality,
    getStreetsByMunicipalityId,
    getStreetById,
    createStreet,
    deleteStreet,
    getStreetNumbersByStreetId,
    getStreetNumberById,
    createStreetNumber,
    deleteStreetNumber,
};
