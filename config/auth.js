// exports.auth = {
//   guards: [
//     {
//       student: {//عملنا هيك عشان كل واحد بدنا خاصيتو
//         driver: "session",
//         provider: "students",
//       },
//       admin: {
//         driver: "session",
//         provider: "admins",
//       },
//     },
//   ],
// };

const Student = require("../models/students");
const PasswordRestToke = require("../vendor/Authenticate/models/PasswodeResetToken");
// const PasswordReset = require("../vendor/Authenticate/PasswordReset");//(node:1600) Warning: Accessing non-existent property 'auth' of module exports inside circular dependency
// (Use `node --trace-warnings ...` to show where the warning was created) // هادا الايرور طلع عشان ملفين بكونو بستدعو بعض ف بصير انفينت لووب

//بدنا نعمل طبقة كاملة من مفهوم الكونفيق فايلز
//ملفات خدماتية معرف فيها جملة من الاسس  والمفاهيم والقوانين
//infasturctue //شيء مبني على اصول علمية صحيحة

exports.auth = {
  defaults: {
    guard: "student",
    passwordReset: "student",
  },
  guards: {
    //بدنا نعرف انواع المستحدمين الي عنا في النظام
    student: {
      driver: "session", //sessions or token , token for api , session for wep and spa  //للكوكيز في الاس يس اي
      provider: "students", //لازم نعرفو تحت
    },
    student_api: {
      driver: "token", //sessions or token , token for api , session for wep and spa  //للكوكيز في الاس يس اي
      provider: "students", //the same provider
    },
    // admin :{
    //     driver:"session" ,
    //     provide :"admins"
    // }
  },
  providers: {
    //provider is the name of the table wiht s
    //data sourse
    students: {
      modelname: "Student",
      model: Student,
      driver: "Sequelize",
    },
    // admin:{//لو  كنا بنشتغل داتا بيز
    //     table : "admins",
    //     driver: "database"
    // }
  },
  password_reset: {
    student: {
      //student the same name as the guard
      model: PasswordRestToke,
      expired_after: 5, //5 دقايق عشان نعمل الي في المودل متغير ونعدل من هان
    },
    user: {
      //لازم نعمل  بروكر عشان موضوع القارد  //بروكر للديفولت
      //student the same name as the guard
      model: PasswordRestToke,
      expired_after: 5, //5 دقايق عشان نعمل الي في المودل متغير ونعدل من هان
    },
  },
};

//هادا الشغل بسهل علينا عملية اضافة اي مستخدم اخر بس بنضيف غارد وبروفايدر
