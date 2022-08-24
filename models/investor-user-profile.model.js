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
            address: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            municipality: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            country: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            facebookLink: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            twitterLink: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            linkedInLink: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            instagramLink: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            businessType: {
                type: Sequelize.STRING,
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
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
        });
        
        InvestorUserProfiles.associate = function(models) {
            models.InvestorUserProfiles.hasOne(models.Users, {
                foreignKey: "user_id",
                targetKey: "id",
                as: "user",
            });
        };

        return InvestorUserProfiles;
};
