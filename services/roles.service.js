const db = require("../models");

async function getRoleById(id) {
    return db.Roles.findOne({
        where: {
            id: id
        }
    });
}

async function getRoleByName(name) {
    return db.Roles.findOne({
        where: {
            name: name
        }
    });
}

module.exports = {
    getRoleById,
    getRoleByName,
};
