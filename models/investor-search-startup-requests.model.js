module.exports = (sequelize, Sequelize) => {
    const InvestorSearchStartupRequest = sequelize.define(
        "InvestorSearchStartupRequest",
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
    
    InvestorSearchStartupRequest.associate = function(models) {
        models.InvestorSearchStartupRequest.belongsTo(models.Users, {
            foreignKey: "userId",
            targetKey: "id",
            as: "investorSearchRequest",
        });
    };

    return InvestorSearchStartupRequest;
};
