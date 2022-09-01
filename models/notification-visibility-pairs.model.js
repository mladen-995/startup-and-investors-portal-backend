module.exports = (sequelize, Sequelize) => {
    const NotificationVisibilityPairs = sequelize.define(
        "NotificationVisibilityPairs",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            notificationsId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            pairId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
        });
    
        NotificationVisibilityPairs.associate = function(models) {
        models.NotificationVisibilityPairs.belongsTo(models.Notifications, {
            foreignKey: "notificationsId",
            targetKey: "id",
            as: "notificationsPairs",
        });
    };

    return NotificationVisibilityPairs;
};
