// const DataTypes = require("sequelize"); //من غير ديستركتشر عشان نجيب الاوبجكت العام من السيكوالايز
const { DataTypes } = require("sequelize");
const sequalize = require("../config/database");
const Task = require("./Tasks");
// const Authorize = require("../vendor/Auth/Authorize");

//اسم المودل لازم يكون مفرد عن اسم الجدول
const Admin = sequalize.define(
  "admin",
  {
    id: {
      //قيمة رقمية موجبة تبدا من الرقم واحد تزداد زيادة نلقائية  و بتتكررش
      type: DataTypes.BIGINT({ zerofill: false, unsigned: true }),
      primaryKey: true,
      autoIncrement: true,
      // autoIncrementIdentity:{}//تعطي خصائص للاوتو انكرمنت
    }, //COLUMN
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // VIRTUAL//لما بدنا نعمل عملية دمج لاكتر من قيمة بدنا نحطهم في عمود تاني من غير مناثر على الفاليو تبعتهم
    //getDataValue //بتخلي القيمة الاصلية تروح
    fullName: {
      //apended atripute in laravel
      type: DataTypes.VIRTUAL, //بنعملش الو اضافة على مستوى الداتا بيز بس هوا موجود وبنعمل الو قيتر
      get() {
        return this.firstName + " " + this.getDataValue("lastName");
      },
    },
    email: {
      type: DataTypes.STRING(100), //Length = 100
      allowNull: false,
      // unique: true,//الكونسترينت بعمل تراي كاتش على الكويري , تعديل المسج عل كونسترينت شغل النود مش الداتا بيز
      unique: { msg: "Email already used , use another" },
      validate: {
        //فالديت على مستوى المودل قبل التخزين في الداتا بيز قبل ميطلع الكويري اصلا
        // isEmail : true ,
        notEmpty: { msg: "Email value cant be empty" },
        isEmail: { msg: "Enter correct email address" }, //المسج هيا بديل الترو
        notNull: { msg: "Email can't be null" },
        abc() {
          //custom validation has  higher proriaty اولوية اعلى
          //check...if fasle -> throw new Error();
          let result = this.get("email").length < 3;
          if (result) throw new Error("Custom error message");
        },
      },
    },
    gender: {
      type: DataTypes.ENUM("M", "F"), //rest take many values
      allowNull: false,
      // get(value){
      //   return value==="M" ? "male": "female"
      // }
      get() {
        return this.getDataValue("gender") === "M" ? "Male" : "Female";
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blooked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    image: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: true, //keep created at , updated at
    tableName: "admins", //جمع المودل
    //  , deletedAt : // بنضاف عشان يمنع الحذف الاجباري  بتصير البيانات تتخزن بس
    paranoid: true, //يعني رح يعررف كمان كولوم اسمو deleted at
    // لما يكون الديليتد ات نل يعني الصف مش محذوف لما تكون ماخدة وقت يعني تاريخ ووقت الحذف
    //soft delete in laravel
    //لو كانت فولس بروح جدول ديليتيد ات
  }
);
//ممكن ميزبطش
// Authorize.getInstance().defineAuthorization(Student);//نقلناها على المايقريشنز في الاوثورايزيشن//لو ضلت رح يكون في ايرور مع الاوثورايز الي فوق في الاستدعاء لانو استدعينا الاوثورايز قبل منعرف الستيودنت يعني لو نزلنا استدعاء الاوثورايز تحت رح يزبط

// Student.hasMany(Task, {//نقلناهم على المايقريشن في الريليشن
//   foreignKey: "student_id",
//   onDelete: "RESTRICT",
//   as: "tasks",
// }); //DEFUALT CASCADE

// Task.belongsTo(Student, { foreignKey: "student_id", onDelete: "RESTRICT" ,as:"students" }); //ينتمي الى مستخدم واحد

module.exports = Admin;
