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
            }
        }, {
            underscored: true,
            timestamps: true,
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
        models.User.hasOne(models.StartupUserProfile, {
            foreignKey: "user_id",
            as: "startup_profile",
        });
        models.User.hasOne(models.InvestitorUserProfiles, {
            foreignKey: "user_id",
            as: "investitor_profile",
        });
    };

    Users.prototype.validPassword = async (password, hash) => {
        return await bcrypt.compareSync(password, hash);
    };

    return Users;
};
