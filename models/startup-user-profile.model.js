module.exports = (sequelize, Sequelize) => {
    const StartupUserProfiles = sequelize.define(
        "StartupUserProfile",
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
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
        });

        StartupUserProfiles.associate = function(models) {
            models.StartupUserProfiles.hasOne(models.Users, {
                foreignKey: "user_id",
                targetKey: "id",
                as: "user",
            });
        };

        return StartupUserProfiles;
};
