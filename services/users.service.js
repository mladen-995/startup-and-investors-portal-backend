const db = require("../models");

async function getUserByEmail(email) {
    return db.Users.findOne({
        where: {
            email: email
        }
    });
}

async function registerUser(email, password, firstName, lastName, roleId, middleName = null) {
    return db.Users.create({
        email,
        password,
        firstName,
        lastName,
        roleId,
        middleName,
    });
}

module.exports = {
    getUserByEmail,
    registerUser,
};
