const { body, param } = require("express-validator");
const { ApplicationError } = require("../errors.util");

module.exports = {
    registerInvestor: [
        body(["username", "email", "password", "firstName", "lastName", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "streetId", "streetNumberId", "municipalityId", "cityId", "countryId", "phone", 
            "instagramLink", "businessTypeId", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "investorType", 
            "providedServiceTypes", "minAmountOfMoney", "maxAmountOfMoney", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName", "facebookLink", "twitterLink", "linkedInLink", "companyInfo")
            .optional(),
    ],
    registerStartup: [
        body(["username", "email", "password", "firstName", "lastName", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "streetId", "streetNumberId", "municipalityId", "cityId", "countryId", "phone", 
            "instagramLink", "businessTypeId", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "projectProposal", 
            "requiredAmountOfMoney", "intellectualPropertyStatus", "patentInfo", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName", "facebookLink", "twitterLink", "linkedInLink", "areasOfInterestId", "profesionalSkillsId")
            .optional(),
    ],
    updateInvestor: [
        // body(["username", "firstName", "lastName", "email", "tin", "legalEntityName", "website", "establishmentDate", 
        //     "registrationNumber", "streetId", "streetNumberId", "municipalityId", "cityId", "countryId", "phone", 
        //     "instagramLink", "businessTypeId", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "investorType", 
        //     "providedServiceTypes", "minAmountOfMoney", "maxAmountOfMoney", "logo"])
        //     .notEmpty()
        //     .withMessage("Please make sure you filled out all the fields."),
        // body("middleName", "facebookLink", "twitterLink", "linkedInLink")
        //     .optional(),
    ],
    updateStartup: [
        // body(["username", "firstName", "lastName", "email", "tin", "legalEntityName", "website", "establishmentDate", 
        //     "registrationNumber", "streetId", "streetNumberId", "municipalityId", "cityId", "countryId", "phone", 
        //     "instagramLink", "businessTypeId", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "projectProposal", 
        //     "requiredAmountOfMoney", "intellectualPropertyStatus", "patentInfo", "logo"])
        //     .notEmpty()
        //     .withMessage("Please make sure you filled out all the fields."),
        // body("middleName", "facebookLink", "twitterLink", "linkedInLink", "areasOfInterestId", "profesionalSkillsId")
        //     .optional(),
    ],
    updateAdministrator: [
        body(["username", "firstName", "lastName", "email" ])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName")
            .optional(),
    ],
    getInvestor: [
        param("investorId")
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
    ],
    getStartupPublicFields: [
        param("startupId")
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
    ],
    updateStartupPublicFields: [
        param("startupId")
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
    ],
    getStartup: [
        param("startupId")
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
    ],
    approveUserCreationRequest: [
        param("requestId")
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
    ],
    approveInvestorSearchRequest: [
        param("requestId")
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
    ],
    muteInvestor: [
        param("investorId")
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
    ],
    unmuteInvestor: [
        param("investorId")
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
    ],
    changePassword: [
        body(["oldPassword", "newPassword"])
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
    ],
    requestPasswordReset: [
        body("username")
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
    ],
    resetPassword: [
        param("token")
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
        body("newPassword")
        .notEmpty()
        .withMessage("Please make sure you filled out all the fields."),
    ],
    getStatistics: [
        body(["dateFrom", "dateTo" ])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        
        function(req, res, next) {
            if (new Date(req.body.dateFrom).getTime() > new Date(req.body.dateTo).getTime()) {
                throw new ApplicationError("dateFrom cannot be after dateTo!", 422);
            }
            return next();
        }
    ]
};
