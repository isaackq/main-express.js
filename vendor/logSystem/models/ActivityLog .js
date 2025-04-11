const { DataTypes } = require("sequelize");
const sequalize = require("../../../config/database");

// vendor/logSystem/models/ActivityLog.js

const ActivityLog = sequalize.define(
  "activity_log",
  {
    id: {
      type: DataTypes.BIGINT({ zerofill: false }),
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "activity_logs",
    timestamps: false,
  }
);
module.exports = ActivityLog;
