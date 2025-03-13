const sequalize = require("../config/database");
const Task = require("../models/Tasks");
const Student = require("../models/students");
const Authorize = require("../vendor/Auth/Authorize");

module.exports = class Migration {//الغرض من الملف تسلسل التنفيذ لحل مشكلة  اسبقية انشاء الاوبجكت عشان  نحل مشكلة الاووث 
  sync() {//الداتا بيز لازم تكون موجودة قبل البروجكت يعني قبل منعطي سلف للبروجكت 
    this.#relations();
    this.#authorization();
    sequalize
      .sync({ force: false }) //السينك وظيفتها عدم حذف الجداول بس بنضبف عليها عادي
      .then(() => {
        console.log("Synced Successfully");
      })
      .catch(() => {
        console.log("Error Occured"); //خطأ في بنية الجداول في السينتكس
      });
  }
  
  #relations() {
    //define your relations here...
    Student.hasMany(Task, {
        foreignKey: "student_id",
        onDelete: "RESTRICT",
        as: "tasks",
      }); //DEFUALT CASCADE
      
      Task.belongsTo(Student, { foreignKey: "student_id", onDelete: "RESTRICT" ,as:"students" });
  }

  #authorization(){
    //شغال على مبدا البروتو تايب وهو اسلوب يستخدم لعملية الانجكشن على مستوى الاوبجكت ولكن من خلال الكلاس يعني بنضيف على الكلاس شغلات من خلال بروتو تايب اوف كلاس مشابه للاقريقيشن فنكشنز تبعت السيكوالايز 
    Authorize.getInstance().defineAuthorization(Student);//بنضيف المودلز حسب الحاجة للاوثورايزيشن
  }
};
