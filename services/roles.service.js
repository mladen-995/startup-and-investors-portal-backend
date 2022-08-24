const db = require("../models");

async function getRoleByName(name) {
    return db.Roles.findOne({
        where: {
            name: name
        }
    });
}

module.exports = {
    getRoleByName
};
