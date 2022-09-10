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

async function deleteCountry(userId, countryId) {
    let userProfile = await usersService.getInvestorUserProfileByCountryId(countryId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByCountryId(countryId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    return locationsService.deleteCountry(userId, countryId);
}

async function getCities(countryId, filter, pagination) {
    return locationsService.getCitiesByCountryId(countryId, filter, pagination);
}


async function getAllCities(filter, pagination) {
    const cities = await locationsService.getAllCities(filter, pagination);
    for (const city of cities) {
        city.dataValues.country = city.cities.name;
        delete city.dataValues.cities;
    }
    return cities;
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

async function deleteCity(userId, cityId) {
    let userProfile = await usersService.getInvestorUserProfileByCityId(cityId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByCityId(cityId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    return locationsService.deleteCity(userId, cityId);
}

async function getAllMunicipalities(filter, pagination) {
    const municipalities = await locationsService.getAllMunicipalities(filter, pagination);
    for (const municipality of municipalities) {
        municipality.dataValues.city = municipality.municipalities.name;
        delete municipality.dataValues.municipalities;
    }
    return municipalities;
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

async function deleteMunicipality(userId, municipalityId) {
    let userProfile = await usersService.getInvestorUserProfileByMunicipalityId(municipalityId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByMunicipalityId(municipalityId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    return locationsService.deleteMunicipality(userId, municipalityId);
}

async function getAllStreets(filter, pagination) {
    const streets = await locationsService.getAllStreets(filter, pagination);
    for (const street of streets) {
        street.dataValues.municipality = street.streets.name;
        delete street.dataValues.streets;
    }
    return streets;
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

async function deleteStreet(userId, streetId) {
    let userProfile = await usersService.getInvestorUserProfileByStreetId(streetId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByStreetId(streetId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    return locationsService.deleteStreet(userId, streetId);
}

async function getAllStreetNumbers(filter, pagination) {
    const streetNumbers = await locationsService.getAllStreetNumbers(filter, pagination);
    for (const streetNumber of streetNumbers) {
        streetNumber.dataValues.street = streetNumber.streetNumbers.name;
        delete streetNumber.dataValues.streetNumbers;
    }
    return streetNumbers;
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

async function deleteStreetNumber(userId, streetNumberId) {
    let userProfile = await usersService.getInvestorUserProfileByStreetNumberId(streetNumberId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    userProfile = await usersService.getStartupUserProfileByStreetNumberId(streetNumberId);
    if (userProfile) {
        throw new ApplicationError("Cipher cannot be deleted because it exists in an entity!", 422);
    }
    return locationsService.deleteStreetNumber(userId, streetNumberId);
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
    getAllCities,
    getAllMunicipalities,
    getAllStreets,
    getAllStreetNumbers,
};
