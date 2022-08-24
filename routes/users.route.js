const usersController = require("../controllers/users.controller");

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const token = await usersController.login(email, password);
        res.status(200).json({
            success: true,
            data: {
                token: token,
            },
        });
    } catch (err) {
        next(err);
    }
}

async function registerInvestor(req, res, next) {
    try {
        const { email, password, firstName, lastName, middleName, tin, legalEntityName, website, establishmentDate, registrationNumber,
            address, municipality, city, country, phone, facebookLink, twitterLink,
            linkedInLink, instagramLink, businessType, employeeNumber, currentCompanyPhase, 
            lastThreeYearIncome, lastThreeYearProfit, investorType, providedServiceTypes, 
            minAmountOfMoney, maxAmountOfMoney, logo} = req.body;
        const user = { 
            email, 
            password, 
            firstName, 
            lastName, 
            middleName
        };
        const userProfile = {
            tin, 
            legalEntityName, 
            website, 
            establishmentDate, 
            registrationNumber,
            address, 
            municipality, 
            city, 
            country, 
            phone, 
            facebookLink, 
            twitterLink,
            linkedInLink, 
            instagramLink, 
            businessType, 
            employeeNumber, 
            currentCompanyPhase, 
            lastThreeYearIncome, 
            lastThreeYearProfit, 
            investorType, 
            providedServiceTypes, 
            minAmountOfMoney, 
            maxAmountOfMoney, 
            logo,
        };
        await usersController.registerInvestor(user, userProfile);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function registerStartup(req, res, next) {
    try {
        const { email, password, firstName, lastName, middleName, tin, legalEntityName, website, establishmentDate, registrationNumber,
            address, municipality, city, country, phone, facebookLink, twitterLink,
            linkedInLink, instagramLink, businessType, employeeNumber, currentCompanyPhase, 
            lastThreeYearIncome, lastThreeYearProfit, projectProposal, requiredAmountOfMoney, 
            intellectualPropertyStatus, patentInfo, logo} = req.body;
        const user = { 
            email, 
            password, 
            firstName, 
            lastName, 
            middleName
        };
        const userProfile = {
            tin, 
            legalEntityName, 
            website, 
            establishmentDate, 
            registrationNumber,
            address, 
            municipality, 
            city, 
            country, 
            phone, 
            facebookLink, 
            twitterLink,
            linkedInLink, 
            instagramLink, 
            businessType, 
            employeeNumber, 
            currentCompanyPhase, 
            lastThreeYearIncome, 
            lastThreeYearProfit, 
            projectProposal, 
            requiredAmountOfMoney, 
            intellectualPropertyStatus, 
            patentInfo, 
            logo,
        };
        await usersController.registerStartup(user, userProfile);
        res.status(200).json({
            success: true,
        });
    } catch(err) {
        next(err);
    }
}

async function decode(req, res, next) {
    try {
        const { token } = req.body;
        // const decodedToken = usersController.decodeUserJWTToken(token);
        res.status(200).json({
            success: true,
            // data: {
            //     decodedToken: decodedToken,
            // },
        });
        res.status(200);
    } catch(err) {
        next(err);
    }
}

module.exports = {
    login,
    registerStartup,
    registerInvestor,
    decode,
};
