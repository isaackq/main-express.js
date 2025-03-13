//Required modules
const express = require("express");
require("dotenv").config(); //لازم  تكون فوق الراوتس
const weproutes = require("./routes/wep");
const apiroutes = require("./routes/api");
const errors = require("./routes/errors");
const sequalize = require("./config/database");
const session = require("express-session");
//Model
const Student = require("./models/students");
const Task = require("./models/Tasks");
const { methodOverride } = require("./middlewares/methodOverride");
const { sessionErorrs } = require("./middlewares/session-errors");
const { withSessionHandler } = require("./middlewares/wIthSessionHandller");
const {
  preventDuringMaintaunance,
} = require("./middlewares/preventDuringmaintaunance");
const AppProvider = require("./services/AppProvider");
const Route = require("./services/Route");
// const Role = require("./models/authorize/Role");
// const Premission = require("./models/authorize/Permission");
// const RolePermission = require("./models/authorize/RolePermission");
// const ModleHasRole = require("./models/authorize/ModleHasRole");
// const ModleHasPermission = require("./models/authorize/ModleHasPermission");
// const PermissionSeeder = require("./seeders/PermissionSeeder");
// const StudentSeeder = require("./seeders/StudentSeeder");

//.env
// console.log("Dialect:", process.env.DATABASE_DIALECT);

const Authorize = require("./vendor/Auth/Authorize");
const PasswordReset = require("./vendor/Authenticate/PasswordReset");
const { auth } = require("./config/auth");
//Instances
const app = express();
// AppProvider.app = app; //قيمة جديدة واعطيناها الاب
AppProvider.instance.app = app; //after singleton
AppProvider.instance.syncDatabase();
Authorize.getInstance().define();

app.use(
  session({
    secret: "node", // secret used to sign the session cookie
    // resave: false,
    // saveUninitialized: true,//مش ضروري حاليا
    // cookie: { secure: true }
  })
);

//Mildewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//EJS - Template Engine
app.set("view engine", "ejs");
app.set("views", "views"); //يعني الواجهات موجودو في الفيوز

app.use(preventDuringMaintaunance);
app.use(methodOverride);
app.use(withSessionHandler);
app.use(sessionErorrs); //قبل الراوتس
// app.use(sessionStorage);

// Authorize.getInstance().defineAuthorization(Student);////////////////
// Student.findByPk(2).then(async (result) => {//works only when we return the pvr because this model have permaissions via role
//   const r = await result.getpermissions();
// });

// Student.findByPk(6).then(async (result) => {
//   //works only when we return the pvr because this model have permaissions via role
//   const r = await result.givePermissionTo(4);
//   console.log("isaac kamel eqdaih ");
// });

// Student.findByPk(3).then(async (result) => {
//   //works only when we return the pvr because this model have permaissions via role
//   const r = await result.hasRole("Super_admin");
//   console.log(r);
// });

// Student.findByPk(3).then(async (result) => {
//   const roles = await result.hasRole("Super_admin ");
//   console.log(roles);
// });

// Student.findByPk(1).then(async(result)=>{
//   // console.log(result);
//   // Student.assignRole();//هيك بتزبط اما تحت لا يعني بتزبط على مستوى الكلاس
// const r = await  result.hasPermissionTo("Create-Task");
// console.log("dsfsdfasjdfhklsfnh;asdf",r);
// });

// Student.findByPk(1).then((result)=>{
//   // console.log(result);
//   // Student.assignRole();//هيك بتزبط اما تحت لا يعني بتزبط على مستوى الكلاس//هادا قبل البروتوتايب كانت تزبط
//   result.hasPermissionTo("Create-User").then((result)=>{
//     console.log("dsfsdfasjdfhklsfnh;asdf",result);
//   })
// });

// Student.findByPk(3).then((result) => {
//   // result.hasPermissionTo("Create-Task").then((result)=>{
//   //   console.log("result ===> ", result);
//   // })
//   result.getpermissions().then((result) => {});
// });

// app.use((req, res, next) => {
//   // console.log(app._router.stack);
//   // console.log(app.routes);
//   // const stack = app._router.stack;
//   // for(item of stack){
//   //   console.log(item);
//   // }
//   let routes = [];
//   app._router.stack.forEach((item) => {
//     // if (item.route) {//يعني مش انديفياند زي مكان يطلع قبل شوية لما طبعنا الي فوق //regestared directly on the app
//     //   routes.push(item.route)
//     // }//بما انو كل الرواتات من ملف الراوتس يعني فش داعي لالو
//     /*else*/ if (item.name === "router") {
//       item.handle.stack.forEach(function (handler) {
//         //مسجل على الراوت جوا ملف الراوتس
//         // routes.push(handler.route); //مرات بنسجل راوتس على مستوى الااب دوت يوز ف بحمل ملف راوتر كامل //الراوتر هوا الي مسجلو
//         routes.push({ path: handler.route.path, method: handler.route.method });
//       });
//     }
//   });

//   console.log(routes);
//   next();
// }); //حتى لو اجا قبل الرواتس رح يشتغل برضو لانو هادا انستنس يعني رح تتطبق العمليات

//Routes
// app.use(Route.prefix("/cms"), weproutes);//شلنا الادمن عشان تعمل تسجيل دخول  مرة من ادمن ومرة من يوزر
// app.use(Route.prefix("/api"), apiroutes);

app.use("/api", apiroutes);
app.use("/cms", weproutes);
app.use("/err", errors);

//General handller
app.use((error, req, res, next) => {
  if (req.headers.accept === "application/json") {
    res.status(404).send({ status: false, message: "404 not found " });
  } else {
    res.render("layouts/errors/404-error", { error: error.message }); //المسج احنا الي باعتينها في الايرور
  }
});

//بدنا نعمل ملف فيه بيرميشنز وننفذو
//permission is code level apply //لانو البيرميشنز بتمنع كود يتنفذ ف كيف بدنا نسقط البيرميشن على الكود , لازم نكون كاتبين كود
//if user has a permission for somethind to do
//البيرميشنز لا تضاف الى في مرحلة البرمجة يعني بتنضافش من لوحة التحكم
//البيرميشنز عبارة عن عمليات فحص تضاف على الراوتس او الفرونت اند او على اشي مش واضح كويس من الفيديو ,يضاف نص البيرميشن
//حتى  نتمكن من عمل ايغر او ليزي لودينق
//بنحط جوا الثرو الجدول الوسيط  //البريميشن هيا التارغت كي
// Role.belongsToMany(Premission, {
//   //بريميشن هوا التارقت والرول هوا السورس
//   through: RolePermission,
//   foreignKey: "role_id",
//   otherKey: "permission_id",
// }); //علاقة تبادلية بين الجهتين زي الطالب له اكتر من مادة والمادة لها اكتر من طالب //علاقة مني تو مني
// Role.hasMany(ModleHasRole, { foreignKey: "role_id" });
// Premission.hasMany(ModleHasPermission, {
//   foreignKey: "permission_id",
//   as: "permissions",
// }); //لانو البيرميشن موجودة اكتر من مرة في جدول مودل هاز بيرميشن
// ModleHasPermission.belongsTo(Premission, {
//   foreignKey: "permission_id",
//   as: "permissions",
// });

// sequalize//نقلناها على ملف المايقريشن
//   .authenticate()
//   .then(() => {
//     //لما بدنا نعدل الاسم لازم من هان ومن عند العلاقة
//     // Student.hasMany(Task, {
//     //   foreignKey: "student_id",
//     //   onDelete: "CASCADE",
//     //   as: "tasks",
//     // }); //DEFUALT CASCADE
//     // Task.belongsTo(Student, {
//     //   foreignKey: "student_id",
//     //   onDelete: "CASCADE",
//     //   as: "students",
//     // }); //ينتمي الى مستخدم واحد
//     //force يعني في كل مرة بعمل رن يعني بصير دروب للجداول
//     sequalize
//       .sync({ force: false }) //السينك وظيفتها عدم حذف الجداول بس بنضبف عليها عادي
//       .then(() => {
//         // PermissionSeeder.run();
//         // StudentSeeder.run();
//         //in the same sition //بدل منضل نعمل اوييت
//         console.log("Connected to Database & Tables created Successfully");
//         //Server //ازا نجح في الاتصال في الداتا بيز شغل السيرفر
//         // app.listen(5000, (req, res, next) => {//منطق نشغل السيرفر بس نتاكد من الداتا بيز غير صحيح لانو على سيرفر بختلف الموضوع
//         //   console.log("Server started :: 5000 ");
//         //   console.log("Server started :: 5000 ");
//         //   console.log("Server started :: 5000 ");
//         //   console.log("Server started :: 5000 ");
//         //   console.log("Server started :: 5000 ");
//         // });
//       })
//       .catch(() => {
//         console.log("Error Occured"); //خطأ في بنية الجداول في السينتكس
//       });
//   })
//   .catch((error) => {
//     console.log("Connection Authentication Error" + error);
//   }); //لو طلع الايرور هادا بكون خلل في الاتصال

PasswordReset.instance.forEmail("isaac@email.com").requestReset();

app.listen(5000, (req, res, next) => {
  console.log("Server started :: 5000 ");
  console.log("Server started :: 5000 ");
  console.log("Server started :: 5000 ");
  console.log("Server started :: 5000 ");
  console.log("Server started :: 5000 ");
});
