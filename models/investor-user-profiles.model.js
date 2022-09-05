module.exports = (sequelize, Sequelize) => {
    const InvestorUserProfiles = sequelize.define(
        "InvestorUserProfiles",
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
            investorType: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            providedServiceTypes: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            minAmountOfMoney: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            maxAmountOfMoney: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            logo: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            canSearchStartups: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });
        
        InvestorUserProfiles.associate = function(models) {
            models.InvestorUserProfiles.belongsTo(models.Users, {
                foreignKey: "userId",
                targetKey: "id",
                as: "investorProfile",
            });
            models.InvestorUserProfiles.belongsTo(models.StreetNumbers, {
                foreignKey: "streetNumberId",
                targetKey: "id",
                as: "streetNumberInvestorUserProfiles",
            });
            models.InvestorUserProfiles.belongsTo(models.Streets, {
                foreignKey: "streetId",
                targetKey: "id",
                as: "streetInvestorUserProfiles",
            });
            models.InvestorUserProfiles.belongsTo(models.Municipalities, {
                foreignKey: "municipalityId",
                targetKey: "id",
                as: "municipalityInvestorUserProfiles",
            });
            models.InvestorUserProfiles.belongsTo(models.Cities, {
                foreignKey: "cityId",
                targetKey: "id",
                as: "cityInvestorUserProfiles",
            });
            models.InvestorUserProfiles.belongsTo(models.Countries, {
                foreignKey: "countryId",
                targetKey: "id",
                as: "countryInvestorUserProfiles",
            });
            models.InvestorUserProfiles.belongsTo(models.Ciphers, {
                foreignKey: "businessTypeId",
                targetKey: "id",
                as: "businessTypesInvestors",
            });
            models.InvestorUserProfiles.hasMany(models.InvestorMutePairs, {
                foreignKey: "investorId",
                as: "investorUserMutePairs",
            });
        };

        return InvestorUserProfiles;
};
