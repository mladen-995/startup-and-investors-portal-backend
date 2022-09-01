module.exports = (sequelize, Sequelize) => {
    const UserSurveyAnswers = sequelize.define(
        "UserSurveyAnswers",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            surveyQuestionId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            userSurveyId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            answer: {
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
        });

    UserSurveyAnswers.associate = function(models) {
        models.UserSurveyAnswers.belongsTo(models.UserSurveys, {
            foreignKey: "userSurveyId",
            targetKey: "id",
            as: "userSurveysAnswers",
        });
        models.UserSurveyAnswers.belongsTo(models.SurveyQuestions, {
            foreignKey: "surveyQuestionId",
            targetKey: "id",
            as: "userSurveyAnswers",
        });
    };

    return UserSurveyAnswers;
};
