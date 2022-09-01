module.exports = (sequelize, Sequelize) => {
    const SurveyQuestions = sequelize.define(
        "SurveyQuestions",
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
            question: {
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

    SurveyQuestions.associate = function(models) {
        models.SurveyQuestions.belongsTo(models.Surveys, {
            foreignKey: "surveyId",
            targetKey: "id",
            as: "surveyQuestions",
        });
        models.SurveyQuestions.hasMany(models.UserSurveyAnswers, {
            foreignKey: "surveyQuestionId",
            as: "userSurveyAnswers",
        });
    };

    return SurveyQuestions;
};
