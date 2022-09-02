module.exports = (sequelize, Sequelize) => {
    const Categories = sequelize.define(
        "Categories",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            dateFrom: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            dateTo: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            entityName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });
    
    Categories.associate = function(models) {
        models.Categories.hasMany(models.News, {
            foreignKey: "categoryId",
            as: "newsCategory",
        });
        models.Categories.hasMany(models.Discussions, {
            foreignKey: "categoryId",
            as: "discussionCategory",
        });
    };

    return Categories;
};
