const lodash = require("lodash");
const db = require("../models");
const { validationResult } = require("express-validator");
const startupGroupsController = require("../controllers/startup-groups.controller");

async function createStartupGroup(req, res, next) {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { name, description, startupIds } = req.body;
        await startupGroupsController.createStartupGroup(req.userId, name, description, startupIds, t);
        await t.commit();
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        await t.rollback();
        next(err);
    }
}

async function getStartupGroups(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["name"];
        const filter = lodash.pick(req.query, filterParams);
        const startupGroups = await startupGroupsController.getStartupGroups(filter, pagination);
        res.status(200).json({
            success: true,
            data: startupGroups,
        });
    } catch(err) {
        next(err);
    }
}

async function getStartupGroup(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const groupId = req.params.groupId;
        const startupGroup = await startupGroupsController.getStartupGroup(groupId);
        res.status(200).json({
            success: true,
            data: startupGroup,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteStartupGroup(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const groupId = req.params.groupId;
        await startupGroupsController.deleteStartupGroup(req.userId, groupId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    createStartupGroup,
    getStartupGroups,
    getStartupGroup,
    deleteStartupGroup,
};
