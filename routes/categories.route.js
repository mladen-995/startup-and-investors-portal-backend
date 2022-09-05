const lodash = require("lodash");
const db = require("../models");
const { validationResult } = require("express-validator");
const categoriesController = require("../controllers/categories.controller");

async function createCategory(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { name, dateFrom, dateTo, entityName } = req.body;
        await categoriesController.createCategory(req.userId, name, dateFrom, dateTo, entityName);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function getCategories(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const { pagination } = req.params;
        const filterParams = ["name"];
        const filter = lodash.pick(req.query, filterParams);
        const { entityName, activeOnly } = req.body;
        const categories = await categoriesController.getCategories(entityName, activeOnly, filter, pagination);
        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch(err) {
        next(err);
    }
}

async function getCategory(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const categoryId = req.params.categoryId;
        const category = await categoriesController.getCategoryById(categoryId);
        res.status(200).json({
            success: true,
            data: category,
        });
    } catch(err) {
        next(err);
    }
}

async function deleteCategory(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errorCode: 422, errors: errors.array() });
        }
        const categoryId = req.params.categoryId;
        await categoriesController.deleteCategory(req.userId, categoryId);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    deleteCategory,
};
