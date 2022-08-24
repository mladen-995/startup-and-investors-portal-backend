module.exports = {
    host: process.env.DB_CONTAINER_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: "postgres",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
