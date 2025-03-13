//نفس فكرة modelhaspermission
const { DataTypes } = require("sequelize");
// const sequalize = require("../../config/database"); //بتعطي انستانسز
// import sequalize from "../../config/database";//بتجيب ريفيرانس كامل على عنصر معين
const sequalize = require("../../../config/database");

//Modle name
const ModleHasRole = sequalize.define(
  "modele_has_role",
  {
    id: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      primaryKey: true,
      autoIncrement: true,
    },
    role_id: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
    model_id: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false, //هادا رح يكون فورجن كي
    },
    model_type: {
      type: DataTypes.STRING({ length: 50 }),
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ["model_id", "model_type", "role_id"], unique: true }],
  }
);

module.exports = ModleHasRole;
