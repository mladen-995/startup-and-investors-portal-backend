module.exports = (sequelize, Sequelize) => {
    const DiscussionVisibilityPairs = sequelize.define(
        "DiscussionVisibilityPairs",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            discussionId: {
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
    
    DiscussionVisibilityPairs.associate = function(models) {
        models.DiscussionVisibilityPairs.belongsTo(models.Discussions, {
            foreignKey: "discussionId",
            targetKey: "id",
            as: "discussionPairs",
        });
    };

    return DiscussionVisibilityPairs;
};
