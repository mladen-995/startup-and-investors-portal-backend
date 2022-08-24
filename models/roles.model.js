module.exports = (sequelize, Sequelize) => {
    const Roles = sequelize.define(
        "Roles",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
        });

    return Roles;
};
