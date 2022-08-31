module.exports = (sequelize, Sequelize) => {
    const Discussions = sequelize.define(
        "Discussions",
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
            discussionCategory: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            requestedDeletion: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            isArchived: {
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

    Discussions.associate = function(models) {
        models.Discussions.hasMany(models.DiscussionVisibilityPairs, {
            foreignKey: "discussionId",
            as: "discussionPairs",
        });
        models.Discussions.hasMany(models.DiscussionReplies, {
            foreignKey: "parentId",
            as: "discussionReplies",
        });
    };

    return Discussions;
};
