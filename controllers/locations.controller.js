const locationsService = require("../services/locations.service");
const usersService = require("../services/users.service");
const { ApplicationError } = require("../utils/errors");

async function getCountries(filter, pagination) {
    return locationsService.getAllCountries(filter, pagination);
}

async function getCountry(countryId) {
    return locationsService.getCountryById(countryId);
}

async function createCountry(userId, name) {
    return locationsService.createCountry(userId, name);
}

async function deleteCountry(countryId) {
    let userProfile = await usersService.getInvestorUserProfileByCountryId(countryId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByCountryId(countryId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    return locationsService.deleteCountry(countryId);
}

async function getCities(countryId, filter, pagination) {
    return locationsService.getCitiesByCountryId(countryId, filter, pagination);
}

async function getCity(cityId) {
    return locationsService.getCityById(cityId);
}

async function createCity(userId, name, countryId) {
    const existingCountry = await locationsService.getCountryById(countryId);
    if (!existingCountry) {
        throw new ApplicationError("Country with that id doesn't exist!", 422);
    }
    return locationsService.createCity(userId, name, countryId);
}

async function deleteCity(cityId) {
    let userProfile = await usersService.getInvestorUserProfileByCityId(cityId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByCityId(cityId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    return locationsService.deleteCity(cityId);
}

async function getMunicipalities(cityId, filter, pagination) {
    return locationsService.getMunicipalitiesByCityId(cityId, filter, pagination);
}

async function getMunicipality(municipalityId) {
    return locationsService.getMunicipalitiesId(municipalityId);
}

async function createMunicipality(userId, name, cityId) {
    const existingCity = await locationsService.getCityById(cityId);
    if (!existingCity) {
        throw new ApplicationError("City with that id doesn't exist!", 422);
    }
    return locationsService.createMunicipality(userId, name, cityId);
}

async function deleteMunicipality(municipalityId) {
    let userProfile = await usersService.getInvestorUserProfileByMunicipalityId(municipalityId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByMunicipalityId(municipalityId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    return locationsService.deleteMunicipality(municipalityId);
}

async function getStreets(municipalityId, filter, pagination) {
    return locationsService.getStreetsByMunicipalityId(municipalityId, filter, pagination);
}

async function getStreet(streetId) {
    return locationsService.getStreetById(streetId);
}

async function createStreet(userId, name, municipalityId) {
    const existingMunicipality = await locationsService.getMunicipalitiesId(municipalityId);
    if (!existingMunicipality) {
        throw new ApplicationError("Municipality with that id doesn't exist!", 422);
    }
    return locationsService.createStreet(userId, name, municipalityId);
}

async function deleteStreet(streetId) {
    let userProfile = await usersService.getInvestorUserProfileByStreetId(streetId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByStreetId(streetId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    return locationsService.deleteStreet(streetId);
}

async function getStreetNumbers(streetId, filter, pagination) {
    return locationsService.getStreetNumbersByStreetId(streetId, filter, pagination);
}

async function getStreetNumber(streetNumberId) {
    return locationsService.getStreetNumberById(streetNumberId);
}

async function createStreetNumber(userId, name, streetId) {
    const existingStreet = await locationsService.getStreetById(streetId);
    if (!existingStreet) {
        throw new ApplicationError("Street with that id doesn't exist!", 422);
    }
    return locationsService.createStreetNumber(userId, name, streetId);
}

async function deleteStreetNumber(streetNumberId) {
    let userProfile = await usersService.getInvestorUserProfileByStreetNumberId(streetNumberId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByStreetNumberId(streetNumberId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    return locationsService.deleteStreetNumber(streetNumberId);
}

module.exports = {
    getCountries,
    getCountry,
    createCountry,
    deleteCountry,
    getCities,
    getCity,
    createCity,
    deleteCity,
    getMunicipalities,
    getMunicipality,
    createMunicipality,
    deleteMunicipality,
    getStreets,
    getStreet,
    createStreet,
    deleteStreet,
    getStreetNumbers,
    getStreetNumber,
    createStreetNumber,
    deleteStreetNumber,
};
