const ROLENAMES = {
    ADMINISTARTOR: 'Administrator',
    INVESTOR: 'Investor',
    STARTUP: 'Startup',
};

const NOTIFADVISIBILITYTYPES = {
    STARTUPGROUP: {
        name: 'startupGroup',
        hasPair: true,
        isPairArray: true,
    },
    STRATUPIDS: {
        name: 'startupIds',
        hasPair: true,
        isPairArray: true,
    },
    BUSINESSTYPE: {
        name: 'businessType',
        hasPair: true,
        isPairArray: false,
    },
    STARTUPSONLY: {
        name: 'startupsOnly',
        hasPair: false,
    },
    ALL: {
        name: 'all',
        hasPair: false,
    },
};

const STARTUPPOENTIALYPRIVATEFIELDS = {
    USER: ["firstName", "middleName", "lastName", "email"],
    USERPROFILE: ["tin", "legalEntityName", "website", "establishmentDate", "registrationNumber", "streetNumberId", "streetId", 
        "municipalityId", "cityId", "countryId", "phone", "businessTypeId"],
};

const NEWSVISIBILITYTYPES = {
    INVESTORIDS: {
        name: 'investorIds',
        hasPair: true,
    },
    STRATUPIDS: {
        name: 'startupIds',
        hasPair: true,
    },
    INVESTORSONLY: {
        name: 'investorsOnly',
        hasPair: false,
    },
    STARTUPSONLY: {
        name: 'startupsOnly',
        hasPair: false,
    },
    ALL: {
        name: 'all',
        hasPair: false,
    },
};

const DISCUSSIONVISIBILITYTYPES = {
    INVESTORIDS: {
        name: 'investorIds',
        hasPair: true,
    },
    STRATUPIDS: {
        name: 'startupIds',
        hasPair: true,
    },
    STARTUPSONLY: {
        name: 'startupsOnly',
        hasPair: false,
    },
    ALL: {
        name: 'all',
        hasPair: false,
    },
};

const CATEGORYENTITITES = {
    NEWS: "news",
    DISCUSSIONS: "discussions",
};

const CYPHERTYPES = {
    BUSINESSTYPES: "businessTypes",
    AREASOFINTEREST: "areasOfInterest",
    PROFESSIONALSKILLS: "profesionalSkills",
};

module.exports = {
    ROLENAMES,
    NOTIFADVISIBILITYTYPES,
    NEWSVISIBILITYTYPES,
    DISCUSSIONVISIBILITYTYPES,
    CATEGORYENTITITES,
    CYPHERTYPES,
    STARTUPPOENTIALYPRIVATEFIELDS,
};
