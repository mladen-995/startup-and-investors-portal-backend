module.exports = (sequelize, Sequelize) => {
    const UserSurveys = sequelize.define(
        "UserSurveys",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            surveyId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            rejectsToAnswer: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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

    UserSurveys.associate = function(models) {
        models.UserSurveys.belongsTo(models.Surveys, {
            foreignKey: "surveyId",
            targetKey: "id",
            as: "userSurveys",
        });
        models.UserSurveys.hasMany(models.UserSurveyAnswers, {
            foreignKey: "userSurveyId",
            as: "userSurveysAnswers",
        });
    };

    return UserSurveys;
};
