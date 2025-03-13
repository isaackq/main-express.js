const { Op } = require("sequelize");
const { auth } = require("../../config/auth");
const Task = require("../../models/Tasks");
const Auth = require("../../services/Authenticate");
const ModleHasPermission = require("./models/ModleHasPermission");
const ModleHasRole = require("./models/ModleHasRole");
const Permission = require("./models/Permission");
const Role = require("./models/Role");
const RolePermission = require("./models/RolePermission");

module.exports = class Authorize {
  //هادا اسلوب تاني من السنغلتون
  static #instance = null;

  static getInstance() {
    // console.log(this.#instance === null);
    return (this.#instance ??= new Authorize()); //??=  يعني هات الانستنس  لو مش نل لو نل انشء اوبجكت جديدي وساويه ب الانستانس ورجع الانستانس
  }

  define() {
    //بنحط جواه العلاقات بين جداول البيرمشنز
    Role.belongsToMany(Permission, {
      //بريميشن هوا التارقت والرول هوا السورس
      through: RolePermission,
      foreignKey: "role_id",
      otherKey: "permission_id",
    }); //علاقة تبادلية بين الجهتين زي الطالب له اكتر من مادة والمادة لها اكتر من طالب //علاقة مني تو مني

    Permission.belongsToMany(Role, {
      //عكس العلاقة الي فوقها
      through: RolePermission,
      foreignKey: "permission_id",
      otherKey: "role_id",
    }); //علاقة تبادلية بين الجهتين زي الطالب له اكتر من مادة والمادة لها اكتر من طالب //علاقة مني تو مني

    Role.hasMany(ModleHasRole, { foreignKey: "role_id" });
    ModleHasRole.belongsTo(Role, { foreignKey: "role_id" });
    Permission.hasMany(ModleHasPermission, {
      foreignKey: "permission_id",
      as: "permissions",
    }); //لانو البيرميشن موجودة اكتر من مرة في جدول مودل هاز بيرميشن
    ModleHasPermission.belongsTo(Permission, {
      foreignKey: "permission_id",
      as: "permissions",
    });
  }

  printTest() {
    console.log("Test printed");
  }
  //بدنا نعرف العمليات على مستوى الانستنس مش مستوى الكلاس
  defineAuthorization(model) {
    // console.log(model.prototype);//رح يطبع الاوبجكت مع الدوال تبعوت الايقر لودينق ف بنستخدم نفس الاشي عشان نضيف الميثودز الي تحت
    this.#definePermissionAggregationFunctions(model);
    this.#defineRoleAggregationFunctions(model);
  }
  //الانكلود عبارة عن اوبجكت اجا رجعلك الدوال
  //السيكولايز لما نعمل انكلود بتجيب الاوبجكت وبتحمل عليه المتغيرات والدوال
  #defineRoleAggregationFunctions(model) {
    //دوال شغالة على مستوى انستنس يعني فعليا العمليات تحملت على الكلاس
    console.log(model);
    model.prototype.assignRole = async function (role) {
      const guard = Auth.getGuard(model);
      const targetRole = await Permission.findOne({
        where: {
          [Op.or]: [{ id: role }, { name: role }],
          guard_name: guard,
        }, //يعني ازا بعتنا الايدي تبع البيرمشن او الاسم تبع البيرمشن يزبط
      });
      if (targetRole) {
        try {
          const result = await ModleHasRole.create({
            role_id: targetRole.id,
            model_type: model.name,
            model_id: this.id,
          });
        } catch (error) {
          throw new Error(error.original.sqlMessage); //هندلة للايرور في حال صار تكرار في الاضافة
        }
      } else {
        //لو بدنا نشيل الايلس لازم نحط ريتيرن
        throw new Error(
          `Permission is not found , or not referanced to the current ${guard} guard`
        );
      }
    }; //فنكشن مش ارو فنكشن عشان منفقدش الريفيرنس تبع المودل الي باعتينو

    model.prototype.revokeRole = async function (role) {
      const targetRole = await Permission.findOne({
        where: {
          [Op.or]: [{ id: role }, { name: role }],
          guard_name: guard,
        }, //يعني ازا بعتنا الايدي تبع البيرمشن او الاسم تبع البيرمشن يزبط
      });
      if (targetRole) {
        const count = await ModleHasRole.destroy({
          //ديستروي بترجع رقم
          where: { role_id: targetPermission.id },
        });
        return count > 0;
      }
      throw new Error(
        `Role is not found , or not referanced to the current ${guard} guard`
      );
    }; //احنا هيك ضفنا الدوال على المودل

    model.prototype.hasRole = async function (role) {
      const guard = Auth.getGuard(model);
      const hasRole = await ModleHasRole.count({
        where: { model_type: `${model.name}`, model_id: this.id }, //رح نبدل اليوزر ب ذس لانو احنا جوا الفنكشن يعني بناشر على المودل
        include: [
          //انكلود يعني المودل هاز بيرميشن يحتوي على البيرميشن الي صفاتو زي المبعوتة
          {
            model: Role,
            where: { name: role, guard_name: guard },
            required: true, //تجبر على توافق الشروط كلها يعني يعني لو الوير الي فوق تحققت والي تحت متحققتش يعطي فولس يعني ميجيبش
          },
        ],
      });
      return hasRole > 0;
    };
    //الفنكشن بتعطي ريفيرنس على الي ناداها الي هوا انستنس المودل ولكن الارو فنكشن بتعيطي ريفيرنس على الكلاس
    model.prototype.rolePermissions = async function (roleId) {
      //Role -> Permission through RoleHasPermission //علاقة بين الرول البيرميشن ثرو الرول هاز بيرميشن
      const role = await Role.findAll({ where: { id: roleId } });
      return role.getpermissions();
    };

    model.prototype.getRoles = async function () {
      const guard = Auth.getGuard(model); //اضافة مكانتش موجودة
      return await Role.findAll({
        //جيب كل الرولز تبعت المستخدم بشرط
        where: { guard_name: guard },
        include: [
          {
            model: ModleHasRole, //هات الرول للمستخدم بشرط يكون في لهادا المستخدم رو في جدول المودل هاز بيرميشن عندو هادا الاي دي في الرول
            required: true,
            where: {
              model_id: this.id, //برتبط مع الاي دي في جدول الرول
              model_type: model.name, //هات جميع المودلز الي مرتبطين في نفس المودل
            },
          },
        ],
      });
    };
  }
  //فرض القوانين على المستخدم من خلال الستركتشر الي بنيناه مرفوض

  #definePermissionAggregationFunctions(model) {
    model.prototype.hasPermissionTo = async function (permission) {
      const guard = Auth.getGuard(model);
      const permissions = await ModleHasPermission.count({
        where: { model_type: `${model.name}`, model_id: this.id }, //رح نبدل اليوزر ب ذس لانو احنا جوا الفنكشن يعني بناشر على المودل  // استعملنا المودل عشان نقدر نجيب الاسم اما ذس بتاشر على المودل نفسو ك اوبجكت
        include: [
          //انكلود يعني المودل هاز بيرميشن يحتوي على البيرميشن الي صفاتو زي المبعوتة
          {
            model: Permission,
            as: "permissions",
            where: { name: permission, guard_name: guard },
            required: true, //تجبر على توافق الشروط كلها يعني يعني لو الوير الي فوق تحققت والي تحت متحققتش يعطي فولس يعني ميجيبش
          },
        ],
      });
      return permissions > 0;
    };

    model.prototype.givePermissionTo = async function (permission) {
      const guard = Auth.getGuard(model);
      const targetPermission = await Permission.findOne({
        where: {
          [Op.or]: [{ id: permission }, { name: permission }],
          guard_name: guard,
        }, //يعني ازا بعتنا الايدي تبع البيرمشن او الاسم تبع البيرمشن يزبط
      });
      if (targetPermission) {
        try {
          const result = await ModleHasPermission.create({
            permission_id: targetPermission.id,
            model_type: model.name,
            model_id: this.id,
          });
        } catch (error) {
          throw new Error(error.original.sqlMessage); //هندلة للايرور في حال صار تكرار في الاضافة
        }
      } else {
        throw new Error(
          `Permission is not found , or not referanced to the current ${guard} guard`
        );
      }
    };

    model.prototype.removeDirectPermissionTo = async function (permission) {
      const guard = Auth.getGuard(model);
      const targetPermission = await Permission.findOne({
        where: {
          [Op.or]: [{ id: permission }, { name: permission }],
          guard_name: guard,
        }, //يعني ازا بعتنا الايدي تبع البيرمشن او الاسم تبع البيرمشن يزبط
      });
      if (tergetPermission) {
        const count = await ModleHasPermission.destroy({
          where: { permission_id: targetPermission.id },
        });
        return count > 0;
      }
      throw new Error(
        `Permission is not found , or not referanced to the current ${guard} guard`
      );
    };

    model.prototype.getpermissions = async function () {
      const guard = Auth.getGuard(model);
      //بدل كل الي تحت
      //  const result = await  Permission.findAll({include: [{model: Role,where:{guard_name : guard}}]});//بنقدرش نجيب الرول بيرميشنز لانو فش اشي فيها تابع لليوزر
      const pvr = await Permission.findAll({
        //Permission via Role
        where: { guard_name: guard }, //بدنا نضيف على مستوى البيرميشن
        include: [
          {
            model: Role,
            through: RolePermission,
            required: true,
            include: [
              {
                required: true,
                model: ModleHasRole,
                where: { model_id: this.id, model_type: model.name },
              },
            ],
          },
        ], //بدنا نجيب المودل من الرول ف بنعمل انكلود على مستوى الروول
      }); //مش صح نعكسهم بطلع ايرورر
      //required true enable the through //يعني لو شلناها رح ينفذ عند اول شرط الي هاي المودل ويجيب كل البيرمشنز من غير تحديد للرول

      const dp = await Permission.findAll({
        //direct permission
        where: { guard_name: guard },
        include: [
          {
            required: true,
            model: ModleHasPermission,
            as: "permissions",
            where: { model_id: this.id, model_type: model.name },
          },
        ],
      });

      console.log("reuslt =====", pvr);

      //بندمجهم مع بعض في ارراي عشان  يطلع الناتج ايش منحط 
      // const pvr = Permission.findAll({
      //   where: { guard_name: guard },
      //   include: [
      //     { model: RolePermission },
      //     {
      //       model: ModleHasRole,
      //       where: { model_id: this.id, model_type: model.name },
      //     },
      //   ],
      // });
      // const pvr = ModleHasRole.findAll({
      //   where: { model_id: this.id, model_type: model.name },
      //   include: [
      //     {
      //       required: true,
      //       model: Role,
      //       where: { guard: guard },
      //       include: [
      //         {
      //           required: true,
      //           model: RolePermission,
      //           include: [{ model: Permission, where: { guard_name: guard } }],
      //         },
      //       ],
      //     },
      //   ], //من الرول بدنا نعمل علاقة مع الرول بيرميشنز
      // });
    };
  }
};

// module.exports = class Authorize {//الديزاين بترنز تطبق على كل لغة بنظام مختلف ولكن الكونسبت واحد
//   constructor() {
//     // console.log(!!Authorize.instance);//معناها لا يساوي نل //!!  يعني لا يساوي يساوي
//     if (!!Authorize.instance) { // If an instance doesn't exist, create one
//      console.log("defined");
//       return Authorize.instance;
//     }
//     console.log("Newly Created");
//     Authorize.instance = this;
//     return this;
//   }//هادي  مدرسة من مدارس عدة في انشاء السنقلتون كلاس  عشان بنقدرش نخلي الكونستراكتور برايفت

// printTest(){
//   console.log("Test printed");
// }

// };

//كلاس رح نستدعيه عشان يعمل ديفينشن وتعريف كامل لكل ما يلزم ان يتم تعريفه حتى تشتغل المكتبة
//عشان بكرة في السيرفرات رح يصير كتر الملفات والانستنسس يعمل لخمة و بتوه في الشغل  ف بدنا نعمل اشي يخلينا ننادي كل المكتبة من دالة
//sindlton design pattern : make general object from class  and make it visible every where
//يعني نعمل من كلاس واحد اوبجكت مرة وحدة بس هادا التعريف العام للسينقلتون
//السبب الرئيسي انو في اوجكتات عشان تنتشا بدها جهد  عالي فتكرار انشاء الاوبجكت من نفس الكلاس بمجهود الانشاء العالي يشكل عبئ على ثبات النظام
//فبنعمل اوبجكت واحد من الكلاس طوال فترة تشغيلو
//ايش بفرق عن الستاتيك : انو بنقدر في اي لحظة نعملو ريسيت ونرجعو ل نل على عكس الستاتيك
//2- يعرف عند الحاجة اما الستاتيك يعرف بمجرد ما يتم انشاءه يعني السنغلتون لما بدنا اياه بنشغلو وبنطفيه حسب مبدنا بنكون عاملين دالة تفرغو تعمل ريسيت
//reset = loop of singlton or life cycle of singlton
//الستاتيك بمجرد منشغل المشروع بحمل عشان نرست الستاتيك بدنا نلف عليه كلو بدنا نلف على كل خصائص الكلاس الستاتيك
//اما في السنغلتون صار كل الكلاس سنغل انستانس لما بدنا نرست بنرستو وخلص
//مش شرط كل العمليات الي بدها جهد بدها وقت والعكس صحيح
//يعني لما حد يتصل على التاني بدهش جهد بس بدو وقت عشان يرد عليك

//tests inside app.js
// const auth = new Authorize();
// Authorize.instance.printTest();
// Authorize.getInstance().printTest();
