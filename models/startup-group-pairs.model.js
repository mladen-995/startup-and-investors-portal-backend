module.exports = (sequelize, Sequelize) => {
    const StartupGroupPairs = sequelize.define(
        "StartupGroupPairs",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            startupId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            startupGroupId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });

    StartupGroupPairs.associate = function(models) {
        models.StartupGroupPairs.belongsTo(models.StartupGroups, {
            foreignKey: "startupGroupId",
            targetKey: "id",
            as: "groupStartupPairs",
        });
        models.StartupGroupPairs.belongsTo(models.StartupUserProfiles, {
            foreignKey: "startupId",
            targetKey: "userId",
            as: "startupGroupPairs",
        });
    };

    return StartupGroupPairs;
};
