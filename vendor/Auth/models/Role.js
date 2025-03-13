const { DataTypes } = require("sequelize");
// const sequalize = require("../../config/database"); //بتعطي انستانسز
// import sequalize from "../../config/database";//بتجيب ريفيرانس كامل على عنصر معين
const sequalize = require("../../../config/database");

//Modle name
const Role = sequalize.define("role", {
  id: {
    type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING({ length: 100 }),
    allowNull: false,
  },
  guard_name: {
    type: DataTypes.STRING({ length: 50 }),
    allowNull: false,
  },
});

module.exports = Role ;
