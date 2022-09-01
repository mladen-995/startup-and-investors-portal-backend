module.exports = (sequelize, Sequelize) => {
    const Surveys = sequelize.define(
        "Surveys",
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
            public: {
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
        });

    Surveys.associate = function(models) {
        models.Surveys.hasMany(models.SurveyQuestions, {
            foreignKey: "surveyId",
            as: "surveyQuestions",
        });
        models.Surveys.hasMany(models.UserSurveys, {
            foreignKey: "surveyId",
            as: "userSurveys",
        });
    };

    return Surveys;
};
