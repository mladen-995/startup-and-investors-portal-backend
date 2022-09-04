module.exports = (sequelize, Sequelize) => {
    const Countries = sequelize.define(
        "Countries",
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
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });
    
    Countries.associate = function(models) {
        models.Countries.hasMany(models.StartupUserProfiles, {
            foreignKey: "countryId",
            as: "countryStartupUserProfiles",
        });
        models.Countries.hasMany(models.Cities, {
            foreignKey: "countryId",
            as: "cities",
        });
        models.Countries.hasMany(models.InvestorUserProfiles, {
            foreignKey: "countryId",
            as: "countryInvestorUserProfiles",
        });
    };

    return Countries;
};
