const { auth } = require("../config/auth");
const bcrypt = require("bcrypt");

module.exports = class Auth {
  //factory بس في ابسط صورو سلمنا كلمة وعملنا مقابلها لوجيك كامل في العادة بنعمل على انترفيسيس و ابستراكشن
  //كلمة وحدة بتغير كل اللوجيك
  static #authGuard = auth.defaults.guard; //قيمة افتراضية اولية للقارد

  static guard(guard) {
    this.#authGuard = guard;
    return this; //عملنا هيك عشان نقدر نعمل سلسلة تشين
  }

  static async attempt(req) {
    const guardProvider = auth.guards[this.#authGuard]?.provider;
    if (guardProvider) {
      const provider = auth.providers[guardProvider];
      if (provider.driver === "Sequelize") {
        const password = req.body.password;
        delete req.body.password;
        const model = auth.providers[guardProvider].model;
        console.log(guardProvider);
        console.log(model);
        // console.log(model);  //رح طبع اسم المودل سمول لتر
        // const user = await model.findOne({ where: { email: req.body.email } });
        const user = await model.findOne({ where: req.body }); //اي اشي راح يجي هان رح يكون كولمن
        if (user) {
          // const correctPassword = await bcrypt.compare(req.body.password,user.password);
          const correctPassword = await bcrypt.compare(password, user.password);
          if (correctPassword) {
            req.session.user = user;
            req.session.isAuthenticated = true;
            return true;
          }
        }
        // return false ;
      } else {
        //
      }
      return false;
    }
    throw new Error(`Undifined guard ${this.#authGuard}`); //development error
    // return false ;
  }

  static getModel(guard) {
    //دالة عشان ترجع اسم المودل كامل الكابيتال لتر //بنغعش نعمل اسنك على مستوى القيت
    const guardProvider = auth.guards[guard]?.provider;
    // return auth.providers[guardProvider].modelname;//بنقردر نجيب الاسم بطريقة تانية عن طريق مقارنة الاسامي وبتكون المقارنة كيس ان سينسيتف مع الداتا بيز ولازم يكون اسم المودل زي اسم الانستانس  يعني هادي ملهاش لازمة تقريبا
    return auth.providers[guardProvider].model;
  }

  static getGuard(targetModel) {
    for (const p in auth.providers) {
      // console.log("++++++++++++++",typeof model);//رح يرجع فنكشن لانو في نهاية الامر محملين فنكشن على المودل في الاوثورايز
      // console.log("++++++++++++++", targetModel.name);
      // console.log("++++++++++++++", auth.providers[provider].model );
      const { model } = auth.providers[p];
      // console.log('+++++++++++++++',model);
      if (model === targetModel) {
        for (const guard in auth.guards) {
          const { provider } = auth.guards[guard];
          if (provider === p) {
            return guard;
          }
        }
      }
    }
  }
};

// const keys = Object.keys(req.body);//بدنا نجيب كل اشي ماعادا الباسورد عشان لو بدنا نسجل ب رقم الموبايل مثلا
// const entries = Object.entries(req.body);
// const a = entries.filter((element)=>{element[0] != "password"})
// console.log(a);
// const user = await model.findOne({where : req.body.filter((key , value )=>{key != password})});//مش راح يزبط لانو فلتر بتشتغلش غير على ارراي

// delete req.body.password;
// console.log(req.body);
