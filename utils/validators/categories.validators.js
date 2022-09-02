const { body, param } = require("express-validator");
const { CATEGORYENTITITES } = require("../consts");
const { ApplicationError } = require("../errors");

module.exports = {
    createCategory: [
        body(["name", "dateFrom", "dateTo", "entityName"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),

    function(req, res, next) {
        if (req.body.dateFrom >= req.body.dateTo) {
            throw new ApplicationError("dateTo must be after dateFrom!", 422);
        }
        const categoryEntities = Object.values(CATEGORYENTITITES);
        if (!categoryEntities.includes(req.body.entityName)) {
            throw new ApplicationError("Wrong entity!", 422);
        }
        return next();
    }
    ],
    getCategories: [
        body("entityName")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        
        function(req, res, next) {
            const categoryEntities = Object.values(CATEGORYENTITITES);
            if (!categoryEntities.includes(req.body.entityName)) {
                throw new ApplicationError("Wrong entity!", 422);
            }
            return next();
        }
    ],
    getCategory: [
        param("categoryId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
    deleteCategory: [
        param("categoryId")
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
    ],
};
