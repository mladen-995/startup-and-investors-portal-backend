const { body } = require("express-validator");

module.exports = {
    registerInvestor: [
        body(["username", "email", "password", "firstName", "lastName", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "address", "municipality", "city", "country", "phone", "facebookLink", "twitterLink", "linkedInLink", 
            "instagramLink", "businessType", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "investorType", 
            "providedServiceTypes", "minAmountOfMoney", "maxAmountOfMoney", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName")
            .optional(),
    ],
    registerStartup: [
        body(["username", "email", "password", "firstName", "lastName", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "address", "municipality", "city", "country", "phone", "facebookLink", "twitterLink", "linkedInLink", 
            "instagramLink", "businessType", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "projectProposal", 
            "requiredAmountOfMoney", "intellectualPropertyStatus", "patentInfo", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName")
            .optional(),
    ],
    updateInvestor: [
        body(["username", "firstName", "lastName", "email", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "address", "municipality", "city", "country", "phone", "facebookLink", "twitterLink", "linkedInLink", 
            "instagramLink", "businessType", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "investorType", 
            "providedServiceTypes", "minAmountOfMoney", "maxAmountOfMoney", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName")
            .optional(),
    ],
    updateStartup: [
        body(["username", "firstName", "lastName", "email", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "address", "municipality", "city", "country", "phone", "facebookLink", "twitterLink", "linkedInLink", 
            "instagramLink", "businessType", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "projectProposal", 
            "requiredAmountOfMoney", "intellectualPropertyStatus", "patentInfo", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName")
            .optional(),
    ],
    updateAdministrator: [
        body(["username", "firstName", "lastName", "email" ])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName")
            .optional(),
    ],
};
