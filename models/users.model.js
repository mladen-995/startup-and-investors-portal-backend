const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define(
        "Users",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            middleName: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            lastLoginAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            approved: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            approvedDate: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });

    Users.beforeCreate(async (user) => {
        if (user.password) {
         const salt = await bcrypt.genSaltSync(10, 'a');
         user.password = bcrypt.hashSync(user.password, salt);
        }
    });

    Users.beforeUpdate(async (user) => {
        if (user.password) {
         const salt = await bcrypt.genSaltSync(10, 'a');
         user.password = bcrypt.hashSync(user.password, salt);
        }
    });

    Users.associate = function(models) {
        models.Users.hasOne(models.StartupUserProfiles, {
            foreignKey: "userId",
            as: "startupProfile",
        });
        models.Users.hasOne(models.InvestorUserProfiles, {
            foreignKey: "userId",
            as: "investorProfile",
        });
        models.Users.hasOne(models.UserCreationRequests, {
            foreignKey: "userId",
            as: "userCreationRequest",
        });
        models.Users.hasOne(models.InvestorSearchStartupRequest, {
            foreignKey: "userId",
            as: "investorSearchRequest",
        });
        models.Users.hasMany(models.InvestorMutePairs, {
            foreignKey: "userId",
            as: "userInvestorMutePairs",
        });
        models.Users.hasMany(models.Tokens, {
            foreignKey: "userId",
            as: "passwordTokens",
        });
    };

    Users.prototype.validPassword = async (password, hash) => {
        return await bcrypt.compareSync(password, hash);
    };

    return Users;
};
