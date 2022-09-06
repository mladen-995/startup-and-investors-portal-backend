module.exports = (sequelize, Sequelize) => {
    const StartupGroups = sequelize.define(
        "StartupGroups",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });

    StartupGroups.associate = function(models) {
        models.StartupGroups.hasMany(models.StartupGroupPairs, {
            foreignKey: "startupGroupId",
            as: "groupStartupPairs",
        });
    };

    return StartupGroups;
};
