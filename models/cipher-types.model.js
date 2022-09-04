module.exports = (sequelize, Sequelize) => {
    const CipherTypes = sequelize.define(
        "CipherTypes",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            editableByAll: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        }, {
            underscored: true,
            timestamps: true,
            paranoid: true,
        });
    
    CipherTypes.associate = function(models) {
        models.CipherTypes.hasMany(models.Ciphers, {
            foreignKey: "cipherTypeId",
            as: "ciphers",
        });
    };

    return CipherTypes;
};
