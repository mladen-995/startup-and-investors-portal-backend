module.exports = (sequelize, Sequelize) => {
    const NewsVisibilityPairs = sequelize.define(
        "NewsVisibilityPairs",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            newsId: {
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
    
        NewsVisibilityPairs.associate = function(models) {
        models.NewsVisibilityPairs.belongsTo(models.News, {
            foreignKey: "newsId",
            targetKey: "id",
            as: "newsPairs",
        });
    };

    return NewsVisibilityPairs;
};
