module.exports = (sequelize, Sequelize) => {
    const Municipalities = sequelize.define(
        "Municipalities",
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
            cityId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });
    
    Municipalities.associate = function(models) {
        models.Municipalities.hasMany(models.StartupUserProfiles, {
            foreignKey: "municipalityId",
            as: "municipalityStartupUserProfiles",
        });
        models.Municipalities.hasMany(models.Streets, {
            foreignKey: "municipalityId",
            as: "streets",
        });
        models.Municipalities.hasMany(models.InvestorUserProfiles, {
            foreignKey: "municipalityId",
            as: "municipalityInvestorUserProfiles",
        });
        models.Municipalities.belongsTo(models.Cities, {
            foreignKey: "cityId",
            targetKey: "id",
            as: "municipalities",
        });
    };

    return Municipalities;
};
