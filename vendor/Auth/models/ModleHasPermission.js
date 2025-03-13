const { DataTypes } = require("sequelize");
const sequalize = require("../../../config/database");
// const sequalize = require("../../config/database"); //بتعطي انستانسز
// import sequalize from "../../config/database";//بتجيب ريفيرانس كامل على عنصر معين

//Modle name
const ModleHasPermission = sequalize.define(
  "modele_has_permission",
  {
    id: {
      //في سيستيم شغال وفي بيرميشنز نقطة التلاقي بينهم ملف الاوث عند الاوثونتيكيشن
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      primaryKey: true,
      autoIncrement: true,
    }, //هادا الجدول بدنا نخزن فيه اي دي لمستخدم واي دي للبيرميشن
    permission_id: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false,
    },
    model_id: {
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }),
      allowNull: false, //هادا رح يكون فورجن كي
    },
    model_type: {
      type: DataTypes.STRING({ length: 50 }), //structure relation ship  not a baisc relaionship//ستركتشر معين ولد ريليشن انا قدرت  احللها
      allowNull: false, //morf in laravel//polemarphesem //اختلف طريقة التعامل مع الاي دي باختلاف نوع التايب
    },
  },
  {
    indexes: [
      { fields: ["model_id", "model_type", "permission_id"], unique: true },
    ],
  }
);

module.exports = ModleHasPermission;
