const { body, param } = require("express-validator");

module.exports = {
    registerInvestor: [
        body(["username", "email", "password", "firstName", "lastName", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "streetId", "streetNumberId", "municipalityId", "cityId", "countryId", "phone", 
            "instagramLink", "businessTypeId", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "investorType", 
            "providedServiceTypes", "minAmountOfMoney", "maxAmountOfMoney", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName", "facebookLink", "twitterLink", "linkedInLink", "areasOfInterestId", "profesionalSkillsId")
            .optional(),
    ],
    registerStartup: [
        body(["username", "email", "password", "firstName", "lastName", "tin", "legalEntityName", "website", "establishmentDate", 
            "registrationNumber", "streetId", "streetNumberId", "municipalityId", "cityId", "countryId", "phone", 
            "instagramLink", "businessTypeId", "employeeNumber", "currentCompanyPhase", "lastThreeYearIncome", "lastThreeYearProfit", "projectProposal", 
            "requiredAmountOfMoney", "intellectualPropertyStatus", "patentInfo", "logo"])
            .notEmpty()
            .withMessage("Please make sure you filled out all the fields."),
        body("middleName", "facebookLink", "twitterLink", "linkedInLink")
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
    ]
};
