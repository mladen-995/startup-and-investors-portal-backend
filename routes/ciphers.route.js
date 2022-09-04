const lodash = require("lodash");
const { validationResult } = require("express-validator");
const ciphersController = require("../controllers/ciphers.controller");

async function getCiphers(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["name"];
        const filter = lodash.pick(req.query, filterParams);
        const cipherTypeName = req.params.cipherTypeName;
        const result = await ciphersController.getCiphers(cipherTypeName, filter, pagination);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function getCipher(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const cipherId = req.params.cipherId;
        const result = await ciphersController.getCipher(cipherId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch(err) {
        next(err);
    }
}

async function createCipher(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { name, cipherTypeName } = req.body;
        await ciphersController.createCipher(req.userId, req.role, name, cipherTypeName);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteCipher(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const cipherId = req.params.cipherId;
        await ciphersController.deleteCipher(req.role, cipherId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    getCiphers,
    getCipher,
    createCipher,
    deleteCipher,
};
