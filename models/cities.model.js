module.exports = (sequelize, Sequelize) => {
    const Cities = sequelize.define(
        "Cities",
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
            countryId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });
    
    Cities.associate = function(models) {
        models.Cities.hasMany(models.StartupUserProfiles, {
            foreignKey: "cityId",
            as: "cityStartupUserProfiles",
        });
        models.Cities.hasMany(models.Municipalities, {
            foreignKey: "cityId",
            as: "municipalities",
        });
        models.Cities.hasMany(models.InvestorUserProfiles, {
            foreignKey: "cityId",
            as: "cityInvestorUserProfiles",
        });
        models.Cities.belongsTo(models.Countries, {
            foreignKey: "countryId",
            targetKey: "id",
            as: "cities",
        });
    };

    return Cities;
};
