const usersController = require("../controllers/users.controller");
const db = require("../models");

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const token = await usersController.login(email, password);
        res.status(200).json({
            success: true,
            data: {
                token: token,
            },
        });
    } catch (err) {
        next(err);
    }
}

async function registerInvestor(req, res, next) {
    try {
        const { email, password, firstName, lastName, middleName } = req.body;
        await usersController.registerInvestor(email, password, firstName, lastName, middleName);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function registerStartup(req, res, next) {
    try {
        const { email, password, firstName, lastName, middleName } = req.body;
        await usersController.registerStartup(email, password, firstName, lastName, middleName);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function decode(req, res, next) {
    try {
        const { token } = req.body;
        const decodedToken = usersController.decodeUserJWTToken(token);
        res.status(200).json({
            success: true,
            data: {
                decodedToken: decodedToken,
            },
        });
        res.status(200);
    } catch(err) {
        next(err);
    }
}

module.exports = {
    login,
    registerStartup,
    registerInvestor,
    decode,
};
