module.exports = (sequelize, Sequelize) => {
    const StartupUserProfiles = sequelize.define(
        "StartupUserProfiles",
        {
            userId: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            tin: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            legalEntityName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            website: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            establishmentDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            registrationNumber: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            streetNumberId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            streetId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            municipalityId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            cityId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            countryId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            facebookLink: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            twitterLink: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            linkedInLink: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            instagramLink: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            businessTypeId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            areasOfInterestId: {
                type: Sequelize.UUID,
                allowNull: true,
                defaultValue: null,
            },
            profesionalSkillsId: {
                type: Sequelize.UUID,
                allowNull: true,
                defaultValue: null,
            },
            employeeNumber: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            currentCompanyPhase: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lastThreeYearIncome: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            lastThreeYearProfit: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            projectProposal: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            requiredAmountOfMoney: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            intellectualPropertyStatus: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            patentInfo: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            logo: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });

        StartupUserProfiles.associate = function(models) {
            models.StartupUserProfiles.belongsTo(models.Users, {
                foreignKey: "userId",
                targetKey: "id",
                as: "startupProfile",
            });
            models.StartupUserProfiles.hasMany(models.StartupGroupPairs, {
                foreignKey: "startupId",
                as: "startupGroupPairs",
            });
            models.StartupUserProfiles.belongsTo(models.StreetNumbers, {
                foreignKey: "streetNumberId",
                targetKey: "id",
                as: "streetNumberStartupUserProfiles",
            });
            models.StartupUserProfiles.belongsTo(models.Streets, {
                foreignKey: "streetId",
                targetKey: "id",
                as: "streetStartupUserProfiles",
            });
            models.StartupUserProfiles.belongsTo(models.Municipalities, {
                foreignKey: "municipalityId",
                targetKey: "id",
                as: "municipalityStartupUserProfiles",
            });
            models.StartupUserProfiles.belongsTo(models.Cities, {
                foreignKey: "cityId",
                targetKey: "id",
                as: "cityStartupUserProfiles",
            });
            models.StartupUserProfiles.belongsTo(models.Countries, {
                foreignKey: "countryId",
                targetKey: "id",
                as: "countryStartupUserProfiles",
            });
            models.StartupUserProfiles.belongsTo(models.Ciphers, {
                foreignKey: "businessTypeId",
                targetKey: "id",
                as: "businessTypesStartups",
            });
            models.StartupUserProfiles.belongsTo(models.Ciphers, {
                foreignKey: "areasOfInterestId",
                targetKey: "id",
                as: "areasOfInterestsStartups",
            });
            models.StartupUserProfiles.belongsTo(models.Ciphers, {
                foreignKey: "profesionalSkillsId",
                targetKey: "id",
                as: "profesionalSkillsStartups",
            });
        };

        return StartupUserProfiles;
};
