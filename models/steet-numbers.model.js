module.exports = (sequelize, Sequelize) => {
    const StreetNumbers = sequelize.define(
        "StreetNumbers",
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
            streetId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });
    
    StreetNumbers.associate = function(models) {
        models.StreetNumbers.hasMany(models.StartupUserProfiles, {
            foreignKey: "streetNumberId",
            as: "streetNumberStartupUserProfiles",
        });
        models.StreetNumbers.hasMany(models.InvestorUserProfiles, {
            foreignKey: "streetNumberId",
            as: "streetNumberInvestorUserProfiles",
        });
        models.StreetNumbers.belongsTo(models.Streets, {
            foreignKey: "streetId",
            targetKey: "id",
            as: "streetNumbers",
        });
    };

    return StreetNumbers;
};
