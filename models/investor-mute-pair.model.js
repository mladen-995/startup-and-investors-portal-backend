module.exports = (sequelize, Sequelize) => {
    const InvestorMutePairs = sequelize.define(
        "InvestorMutePairs",
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
            investorId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });
    
    InvestorMutePairs.associate = function(models) {
        models.InvestorMutePairs.belongsTo(models.Users, {
            foreignKey: "userId",
            targetKey: "id",
            as: "userInvestorMutePairs",
        });
        models.InvestorMutePairs.belongsTo(models.InvestorUserProfiles, {
            foreignKey: "investorId",
            targetKey: "userId",
            as: "investorUserMutePairs",
        });
    };

    return InvestorMutePairs;
};
