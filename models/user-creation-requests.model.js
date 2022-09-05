module.exports = (sequelize, Sequelize) => {
    const UserCreationRequests = sequelize.define(
        "UserCreationRequests",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });
    
    UserCreationRequests.associate = function(models) {
        models.UserCreationRequests.belongsTo(models.Users, {
            foreignKey: "userId",
            targetKey: "id",
            as: "userCreationRequest",
        });
    };

    return UserCreationRequests;
};
