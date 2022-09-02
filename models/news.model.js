module.exports = (sequelize, Sequelize) => {
    const News = sequelize.define(
        "News",
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
            categoryId: {
                type: Sequelize.UUID,
                allowNull: true,
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
            }
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });

    News.associate = function(models) {
        models.News.hasMany(models.NewsVisibilityPairs, {
            foreignKey: "newsId",
            as: "newsPairs",
        });
        models.News.belongsTo(models.Categories, {
            foreignKey: "categoryId",
            targetKey: "id",
            as: "newsCategory",
        });
    };

    return News;
};
