module.exports = (sequelize, Sequelize) => {
    const Ads = sequelize.define(
        "Ads",
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
            expiryDate: {
                type: Sequelize.DATE,
                allowNull: false,
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
            }
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });

    Ads.associate = function(models) {
        models.Ads.hasMany(models.AdVisibilityPairs, {
            foreignKey: "adId",
            as: "adPairs",
        });
    };

    return Ads;
};
