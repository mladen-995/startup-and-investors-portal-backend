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
                defaultValue: false,
            },
            middleName: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            lastName: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            email: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            tin: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            legalEntityName: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            website: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            establishmentDate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            registrationNumber: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            streetNumberId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            streetId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            municipalityId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            cityId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            countryId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            phone: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            businessTypeId: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
