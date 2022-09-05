module.exports = (sequelize, Sequelize) => {
    const EntityDeleteLogs = sequelize.define(
        "EntityDeleteLogs",
        {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            entityId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            entityName: {
                type: Sequelize.STRING,
                allowNull: false,
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

    return EntityDeleteLogs;
};
