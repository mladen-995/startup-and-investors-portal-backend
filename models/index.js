const fs = require("fs");
const path = require("path");
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
const db = {};

fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;