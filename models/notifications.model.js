module.exports = (sequelize, Sequelize) => {
    const Notifications = sequelize.define(
        "Notifications",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            text: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            createdBy: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            isArchived: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            requestedDeletion: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            visibility: {
                type: Sequelize.STRING,
                allowNull: false,
            }, 
            isEmailNotification: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });

        Notifications.associate = function(models) {
        models.Notifications.hasMany(models.NotificationVisibilityPairs, {
            foreignKey: "notificationsId",
            as: "notificationsPairs",
        });
    };

    return Notifications;
};
