const { DataTypes } = require("sequelize");
const connection = require("../../../config/database");

const PasswordRestToke = connection.define("password_reset_tokens", {
  //الجدول المخصص لعملية احتواء عمليات الريسيت توكن على مستوى القارد الي شغال عليه
  id: {
    type: DataTypes.BIGINT({ unsigned: true, zerofill: false }), //Zeor fill is by default is false
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE, //date include date and time  , date only include only date without time
    allowNull: false,
  },
});

module.exports = PasswordRestToke;
