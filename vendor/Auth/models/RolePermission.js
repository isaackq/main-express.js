const { DataTypes } = require("sequelize");
// const sequalize = require("../../config/database"); //بتعطي انستانسز
// import sequalize from "../../config/database";//بتجيب ريفيرانس كامل على عنصر معين
const sequalize = require("../../../config/database");

//Modle name
const RolePermission = sequalize.define("role_permission", {
  id: {
    type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
    primaryKey: true,
    autoIncrement: true,
  },
  role_id: {
    type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
    allowNull: false,
  },
  permission_id: {
    type: DataTypes.STRING({ length: 50 }),
    allowNull: false,
  },
});

//السيكواليز بعبي الفورن كيز في علاقات هاز ون و هاز مني اما في علاقة بيلونغز تو مني في الها ضوابط 
module.exports = RolePermission ;
