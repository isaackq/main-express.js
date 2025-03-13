// const ModleHasPermission = require("../../models/authorize/ModleHasPermission");//بدنا نعيد التعريف بعد م نقلنا مكانهم
// const Premission = require("../../models/authorize/Permission");
// const Auth = require("../../services/Auth");

const Auth = require("../../../services/Authenticate");
const ModleHasPermission = require("../models/ModleHasPermission");
const Premission = require("../models/Permission");

exports.authorize = (permission) => {
  //مش حنحط فحص السيشن لانو المفروض تكون واصل هان يكون كلشي مفحوص يعني بادي صح
  return async (req, res, next) => {
    const guard = req.session.guard;
    const user = req.session.user;
    if (user) {
      //Retreive permissions related to the auth user from model-has-permission table
      const model = Auth.getModel(guard); //عملت اضافة على ملف الاوث وجبت المودل نيم من الدالة هادي
      //   console.log(model);
      // const permissions = await ModleHasPermission.findAll({
      //     where: { model_type: model, model_id: user.id },
      //     include :  [{model : Premission , as : "permissions",where:{name :permission , guard_name:guard}}]//eger loading//لانو حنرجع ارراي بنفعش نعمل عليها ليزي لودينق
      //   });

      const permissions = await ModleHasPermission.count({
        where: { model_type: `${model.name}`, model_id: user.id }, //بنحول المودل لسترينق لانو كان بتعامل معو ك انستانس والمقارنة بتكون ان سينسيتف مع الداتا بيز//لانو اسماء الكولمز والتيبلز كيس انسينسيتف
        include: [
          {
            required: true,
            model: Premission,
            as: "permissions",
            where: { name: permission, guard_name: guard },
          },
        ], //eger loading//لانو حنرجع ارراي بنفعش نعمل عليها ليزي لودينق
      });
      console.log(permissions); //رح يطبع رقم

      if (permissions) {
        return next();
      } else {
        res.render("layouts/errors/403-error");
      }

      // console.log(model);
      // console.log(await permissions[0].getPermissions());//لازم القيت تكون بنفس الاسم الي حطيناه في as
      //جبنا البيرميشن الي مربوط بهادا الاي دي في اجدول مودل هاز بيرميشن

      //هادي بنستخدمها ازا كنا عاملين انكلود لو مش عاملين بنقلو قيت بيرميشن بصير ليزي  لودنق
      //  console.log(await permissions[0].permissions);//ايقر لودنق لازم يكون زي اسم ال as
    }
    res.render("layouts/errors/403-error");
  };
};

//شرح ليزي لودينق

// const permissions = await ModelHasPermission.findAll({
//   where: { model_type: "Student", model_id: user.id }
// });

// // Lazy load `Permission` data when needed
// for (let perm of permissions) {
//   const permissionDetails = await perm.getPermission(); // Lazy loading
//   console.log(permissionDetails);
// }
