module.exports = (sequelize, Sequelize) => {
    const AdVisibilityPairs = sequelize.define(
        "AdVisibilityPairs",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            adId: {
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
            paranoid: true,
        });
    
    AdVisibilityPairs.associate = function(models) {
        models.AdVisibilityPairs.belongsTo(models.Ads, {
            foreignKey: "adId",
            targetKey: "id",
            as: "adPairs",
        });
    };

    return AdVisibilityPairs;
};
