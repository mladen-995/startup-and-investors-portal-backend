module.exports = (sequelize, Sequelize) => {
    const Tokens = sequelize.define(
        "Tokens",
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
            token: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });

    Tokens.associate = function(models) {
        models.Tokens.belongsTo(models.Users, {
            foreignKey: "userId",
            as: "passwordTokens",
        });
    };

    return Tokens;
};
