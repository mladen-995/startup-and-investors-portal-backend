const { body } = require("express-validator");

module.exports = {
    registerInvestor: [
        body(["email", "password", "firstName", "lastName", "email", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "address", "municipality", "city", "country", "phone", "facebookLink", "twitterLink", "linkedInLink", 
            "instagramLink", "businessType", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "investorType", 
            "providedServiceTypes", "minAmountOfMoney", "maxAmountOfMoney", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName")
            .optional(),
    ],
    registerStartup: [
        body(["email", "password", "firstName", "lastName", "email", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "address", "municipality", "city", "country", "phone", "facebookLink", "twitterLink", "linkedInLink", 
            "instagramLink", "businessType", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "projectProposal", 
            "requiredAmountOfMoney", "intellectualPropertyStatus", "patentInfo", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName")
            .optional(),
    ],
    updateInvestor: [
        body(["email", "firstName", "lastName", "email", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "address", "municipality", "city", "country", "phone", "facebookLink", "twitterLink", "linkedInLink", 
            "instagramLink", "businessType", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "investorType", 
            "providedServiceTypes", "minAmountOfMoney", "maxAmountOfMoney", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName")
            .optional(),
    ],
    updateStartup: [
        body(["email", "firstName", "lastName", "email", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "address", "municipality", "city", "country", "phone", "facebookLink", "twitterLink", "linkedInLink", 
            "instagramLink", "businessType", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "projectProposal", 
            "requiredAmountOfMoney", "intellectualPropertyStatus", "patentInfo", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName")
            .optional(),
    ],
    updateAdministrator: [
        body(["email", "firstName", "lastName", "email" ])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName")
            .optional(),
    ],
};
