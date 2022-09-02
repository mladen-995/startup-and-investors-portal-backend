module.exports = (sequelize, Sequelize) => {
    const DiscussionReplies = sequelize.define(
        "DiscussionReplies",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            parentId: {
                type: Sequelize.UUID,
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
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });

        DiscussionReplies.associate = function(models) {
        models.DiscussionReplies.belongsTo(models.Discussions, {
            foreignKey: "parentId",
            targetKey: "id",
            as: "discussionReplies",
        });
    };

    return DiscussionReplies;
};
