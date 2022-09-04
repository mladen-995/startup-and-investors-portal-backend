module.exports = (sequelize, Sequelize) => {
    const Ciphers = sequelize.define(
        "Ciphers",
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
            cipherTypeId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });
    
    Ciphers.associate = function(models) {
        models.Ciphers.belongsTo(models.CipherTypes, {
            foreignKey: "cipherTypeId",
            targetKey: "id",
            as: "ciphers",
        });
        models.Ciphers.hasMany(models.InvestorUserProfiles, {
            foreignKey: "businessTypeId",
            as: "businessTypesInvestors",
        });
        models.Ciphers.hasMany(models.StartupUserProfiles, {
            foreignKey: "businessTypeId",
            as: "businessTypesStartups",
        });
        models.Ciphers.hasMany(models.StartupUserProfiles, {
            foreignKey: "areasOfInterestId",
            as: "areasOfInterestsStartups",
        });
        models.Ciphers.hasMany(models.StartupUserProfiles, {
            foreignKey: "profesionalSkillsId",
            as: "profesionalSkillsStartups",
        });
    };

    return Ciphers;
};
