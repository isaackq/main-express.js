const { DataTypes, Sequelize, BIGINT } = require("sequelize");
const connection = require("../config/database");
const Student = require("./students");

let Task = connection.define(
  "Task",
  {
    id: {
      // type : BIGINT.UNSIGNED(true).ZEROFILL(false)
      type: DataTypes.BIGINT({ unsigned: true, zerofill: false }), //زيرو فل يعني يقبل الصفر ولا لا
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false, //constrain on the database level
    },
    image: {
      type: DataTypes.STRING("100"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

// Task.belongsTo(Student, { foreignKey: "student_id", onDelete: "RESTRICT" }); //ينتمي الى مستخدم واحد

module.exports = Task;
