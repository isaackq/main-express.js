const express = require("express");
// const { index, show, create, store, edit, update, destroy, restore, softDelete } = require("../controllers/StudentController");
// const CategoryController = require("../controllers/StudentController")
const StudentController = require("../controllers/StudentController");
const TaskController = require("../controllers/TaskController ");
const { body, check ,param} = require("express-validator");
const Student = require("../models/students");
const { where } = require("sequelize");
const router = express.Router();

//THE SAME AS WEP BUT WITHOUT EDIT AND CREATE

// router.get("/categories",index);
// router.get("/categories/:id",show);
// router.post("/categories",store);
// router.put("/categories/:id",update);
// router.delete("/categories/:id",destroy);

router.get("/students", StudentController.index);
router.get("/students/:id", StudentController.show);
router.post(
  "/students",
  [
    body("email")
      .trim()
      .normalizeEmail()
      .notEmpty()
      .withMessage("email should not be empty")
      .isEmail()
      .withMessage("You should enter email")
      // .isCurrency()//معاملات البنك
      // .custom(async (value)=>{
        //  let result = await Student.findOne({where :{email : value }})
        //   if (result) {
          //     return Promise.reject("E_mail is aldeady used , use another one ") 
          //   }
          // })
          .custom(async (value)=>{
            let count = await Student.count({where : {email: value}})
            if (count> 0) {
             return Promise.reject("E_mail is aldeady used , use another one ") //الريتيرن زي الكاتش للايرور الي هو الريجكشن
            }//promis.reject= throu exiption 
            //الريتيرن عشان نرجع الايرور على الكاتش بلوك تبع الفاليديشن روول 
          })
          ,
    body("gender")
      .trim()
      .notEmpty()
      .withMessage("Gender must not be empty value ")
    //   .isAlpha()//هالك
    //   .withMessage("gender must be char")
      .isIn(["M", "F"])
      .withMessage("gender can only be M or F"),
  ],
  StudentController.store
);
//في حالة الابديت غلط اعمل تشك فاليديتور ازا الايميل موجود او  لا لانو لو بدي  اعدل لنفس الايميبل رح يقول الايميل متكرر
router.put("/students/:id",[param("id").isNumeric({no_symbols: true }).custom((value )=>{
  return Student.count({where : {id : value }}).then((count)=>{//نفس الي فوق بس من غير اسنك و اويت 
    if (count==0 ) return  Promise.reject("Student not found");
  })    //ريجكت عكسها ريسولف بس ما بنستخدمها لانو احنا بنتحقق من الاخطاء فش داعي يعني لو في ايررو اعمل ريجكت لو فش بنكمل 
   //rejection من جوا البرومس 
   //reject and resolve is 2 methods in the promis that tell the sucsiis or fail of the promis operation من جواة قالب الذين
})], StudentController.update);
router.delete("/students/:id", StudentController.destroy);
router.get("/students/:id/restore", StudentController.restore);
router.delete("/students/:id/softDelete", StudentController.softDelete);

router.get("/tasks", TaskController.index);
router.get("/tasks/:id", TaskController.show);
//is alpha عندها خصائص اكتر مثلا  لو بدنا نخليها حروف لغة معينة
//locate حروف من لغة معينة
router.post(
  "/tasks",
  body("title")
    .trim()
    .isAlpha()
    .withMessage("Titel must have chars only")
    .isLength({ min: 3, max: 10 })
    .withMessage("Title must be at least 3 "),
  TaskController.store
);
//يعني ميكنش في رموز في الرقم 
router.put("/tasks/:id", TaskController.update);
router.delete("/tasks/:id", TaskController.destroy);
router.get("/tasks/:id/restore", TaskController.restore);
router.delete("/tasks/:id/softDelete", TaskController.softDelete);

module.exports = router;
