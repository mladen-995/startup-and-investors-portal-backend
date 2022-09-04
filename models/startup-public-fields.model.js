module.exports = (sequelize, Sequelize) => {
    const StartupPublicFields = sequelize.define(
        "StartupPublicFields",
        {
            userId: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            firstName: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            middleName: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            lastName: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            email: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            tin: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            legalEntityName: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            website: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            establishmentDate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            registrationNumber: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            streetNumberId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            streetId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            municipalityId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            cityId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            countryId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            phone: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            businessTypeId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });

        StartupPublicFields.associate = function(models) {
            models.StartupPublicFields.belongsTo(models.StartupUserProfiles, {
                foreignKey: "userId",
                targetKey: "userId",
                as: "startupPublicFields",
            });
        };

        return StartupPublicFields;
};
