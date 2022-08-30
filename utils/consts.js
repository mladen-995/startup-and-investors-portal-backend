const ROLENAMES = {
    ADMINISTARTOR: 'Administrator',
    INVESTOR: 'Investor',
    STARTUP: 'Startup',
};

const ADVISIBILITYTYPES = {
    STARTUPGROUP: {
        name: 'startupGroup',
        hasPair: true,
        isPairArray: false,
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

module.exports = {
    ROLENAMES,
    ADVISIBILITYTYPES,
};
