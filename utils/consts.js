const ROLENAMES = {
    ADMINISTARTOR: 'Administrator',
    INVESTOR: 'Investor',
    STARTUP: 'Startup',
};

const NOTIFADVISIBILITYTYPES = {
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

module.exports = {
    ROLENAMES,
    NOTIFADVISIBILITYTYPES,
    NEWSVISIBILITYTYPES,
};
