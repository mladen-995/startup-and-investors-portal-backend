const lodash = require("lodash");
const { validationResult } = require("express-validator");
const locationsController = require("../controllers/locations.controller");

async function getCountries(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["name"];
        const filter = lodash.pick(req.query, filterParams);
        const result = await locationsController.getCountries(filter, pagination);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function getCountry(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const countryId = req.params.countryId;
        const result = await locationsController.getCountry(countryId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function createCountry(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { name } = req.body;
        await locationsController.createCountry(req.userId, name);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteCountry(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const countryId = req.params.countryId;
        await locationsController.deleteCountry(countryId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getCities(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["name"];
        const filter = lodash.pick(req.query, filterParams);
        const countryId = req.params.countryId;
        const result = await locationsController.getCities(countryId, filter, pagination);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function getCity(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const cityId = req.params.cityId;
        const result = await locationsController.getCity(cityId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function createCity(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { name, countryId } = req.body;
        await locationsController.createCity(req.userId, name, countryId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteCity(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const cityId = req.params.cityId;
        await locationsController.deleteCity(cityId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getMunicipalities(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["name"];
        const filter = lodash.pick(req.query, filterParams);
        const cityId = req.params.cityId;
        const result = await locationsController.getMunicipalities(cityId, filter, pagination);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function getMunicipality(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["name"];
        const filter = lodash.pick(req.query, filterParams);
        const municipalityId = req.params.municipalityId;
        const result = await locationsController.getMunicipality(municipalityId, filter, pagination);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function getStreets(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["name"];
        const filter = lodash.pick(req.query, filterParams);
        const municipalityId = req.params.municipalityId;
        const result = await locationsController.getStreets(municipalityId, filter, pagination);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function createMunicipality(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { name, cityId } = req.body;
        await locationsController.createMunicipality(req.userId, name, cityId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteMunicipality(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const municipalityId = req.params.municipalityId;
        await locationsController.deleteMunicipality(municipalityId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getStreet(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const streetId = req.params.streetId;
        const result = await locationsController.getStreet(streetId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function createStreet(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { name, municipalityId } = req.body;
        await locationsController.createStreet(req.userId, name, municipalityId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteStreet(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const streetId = req.params.streetId;
        await locationsController.deleteStreet(streetId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getStreetNumbers(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["name"];
        const filter = lodash.pick(req.query, filterParams);
        const streetId = req.params.streetId;
        const result = await locationsController.getStreetNumbers(streetId, filter, pagination);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function getStreetNumber(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const streetNumberId = req.params.streetNumberId;
        const result = await locationsController.getStreetNumber(streetNumberId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function createStreetNumber(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { name, streetId } = req.body;
        await locationsController.createStreetNumber(req.userId, name, streetId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteStreetNumber(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const streetNumberId = req.params.streetNumberId;
        await locationsController.deleteStreetNumber(streetNumberId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
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
