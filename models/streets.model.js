module.exports = (sequelize, Sequelize) => {
    const Streets = sequelize.define(
        "Streets",
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
            municipalityId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });
    
    Streets.associate = function(models) {
        models.Streets.hasMany(models.StartupUserProfiles, {
            foreignKey: "streetId",
            as: "streetStartupUserProfiles",
        });
        models.Streets.hasMany(models.StreetNumbers, {
            foreignKey: "streetId",
            as: "streetNumbers",
        });
        models.Streets.hasMany(models.InvestorUserProfiles, {
            foreignKey: "streetId",
            as: "streetInvestorUserProfiles",
        });
        models.Streets.belongsTo(models.Municipalities, {
            foreignKey: "municipalityId",
            targetKey: "id",
            as: "streets",
        });
    };

    return Streets;
};
