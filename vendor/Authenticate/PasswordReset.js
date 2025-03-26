const crypto = require("crypto");
const { auth } = require("../../config/auth");
const Route = require("../../services/Route");
const { where } = require("sequelize");
const PasswordRestToke = require("./models/PasswodeResetToken");
const Mailer = require("../Mailer/Mailer");
const { passwordResetEmail } = require("./emails/password-reset-email");
module.exports = class PasswordReset {
  /**
   * Steps :
   * 1- Genarate reset token (hashed),
   * 2- Store generated hased token in DB
   * 3- Store Expiration date for the password reset link
   * 4- Send email with generated link to the user email
   * 5- prepare a function to check the link when user by the user
   *    - Check the token validation
   *    - Check expiry date
   * 6- if(5) Passed :
   *    - Allow user to set a new password
   *    - Save user new password
   *    - Remove reset token row frome DB
   */

  //Function  e
  // requestPasswordReset(email, guard = auth.defaults.guard) {
  //  //Moved to stor
  //   // const { model, expired_after } = auth.password_reset[guard]; //guard //عشان الشغل يضل ثابت هان
  //   // const token = this.#generateToken();
  //   // const date = this.#expirationDate(expired_after);
  //   // const URL = this.#generateUrl(token, email);
  // }

  //Singleton

  static #instance = null;

  #email = null;
  #guard = auth.defaults.guard;
  #passwordReset = auth.defaults.passwordReset;

  static get instance() {
    //??= means  if not null return , if null create and return
    return (this.#instance ??= new PasswordReset());
  }

  forEmail(email) {
    this.#email = email;
    return this; // to do a chain
  }

  guard(guard) {
    this.#guard = guard;
    return this;
  }

  broker(passwordReset) {
    //fot chcange the guard when apply the reset Process
    this.#passwordReset = passwordReset;
    return this;
  }

  // requestPasswordReset(email, guard = auth.defaults.guard) {
  //   const result = this.#store(email, guard);
  // }

  requestReset() {
    if (this.#email != null) {
      const result = this.#store();
    } else {
      throw new Error("set reset passord email, call forEmail(email)");
    }
  }

  // async reset(req) {//move the function into middleware
  //   /**
  //    * 1- Retreve the req
  //    * 2- Get params and query params from the req
  //    * 3- Check the data of expires_at value if not expired?
  //    *    - Get the token
  //    *    - make a query on password_reset_tokens table using token
  //    *    - validate the expiration date
  //    *    - if not expired , continue //الوقت الي بكون في الجدول وقت مستقبلي بنقارنو ازا اقل او يساوي الحالي
  //    * 4- Check email hash(Digital Signature)
  //    *    - Email : req.query.email (Hashed)
  //    *       - DB :email(Not Hashed)
  //    *       - Hash DB email and compare HASH with HASH
  //    * 5- if pass on comparing, then allow password reset
  //    * 6- Remove the row after password has been reset successfully
  //    */
  //   const token = req.params.token;
  //   const hashedEmail = req.query.email;
  //   const resetRequest = await PasswordRestToke.findOne({
  //     where: { token: token },
  //   });

  //   if (resetRequest != null) {//in evry save we do new URL GENERATED
  //     if (Date.now() <= resetRequest.expires_at) {
  //       //enure that the url time does not end
  //       const requestHashedEmail = crypto //تشفير الايميل الموجود في قاعدة البيانات لمقارنته مع الايميل المشفر الموجود في الرابط
  //         .createHash("sha256")
  //         .update(resetRequest.email)
  //         .digest("hex"); //تشفير الايميل

  //       if (requestHashedEmail === hashedEmail) {
  //         console.log("Perform Password Reset, request is secured and passed");
  //       } else {
  //         console.log("Rejected URL, unsecured email hash");
  //       }
  //     } else {
  //       console.log("Expired request time, Forbidden");
  //     }
  //   } else {
  //     console.log("Invalid Reset Token, Rejected");
  //   }
  // }

  //Function #1

  #generateToken() {
    const token = crypto.randomBytes(32).toString("hex"); //نحول ال 32 بايت ل هكاسا ديسيميل
    console.log(token);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex"); //الاقوريثيمز تبعت التشفير  // برجع قيمة التشفير بالهكسا ديسيميل
    console.log(hashedToken);
    return token;
  }

  #expirationDate(expired_after) {
    //لازم نخزن الوقت على اليونيفيرسال تايم ولو في اي تحويلات حسب المنطقة بكون الها معاملة خاصة بالبرمجة
    const minutes = 1000 * 60 * expired_after; //يعني 5 دقاقئق من الان //لازم نثبت الوقت على وقت السيرفر مش الوقت تبعنا
    return Date.now() + minutes;
  }

  //بيحتاج الايميل تبع المستخدم وبدها تحتاج كذلك نحط في الايميل التوكن المشفرة
  #generateUrl(token, email) {
    //http://DOMAIN.com/TOKEN?email=EMAIL // صيغة الرابط
    const hashedEmail = crypto.createHash("sha256").update(email).digest("hex"); //تشفير الايميل
    return process.env.APP_URL.concat(
      "/cms/password/",
      token,
      "?email=",
      hashedEmail
    );
  }

  async #store() {
    //Store the data in database
    if (Route.isRouteExists("/password/:token")) {
      const { model, expired_after } = auth.password_reset[this.#guard]; //guard //عشان الشغل يضل ثابت هان
      const token = this.#generateToken();
      const date = this.#expirationDate(expired_after);
      const url = this.#generateUrl(token, this.#email);
      console.log("MODEL:", model);
      await model.destroy({ where: { email: this.#email } }); //حذف الطلب السابق ازا نعمل طلب جديد

      const result = await model.create({
        token: token,
        email: this.#email,
        expires_at: date,
      });
      if (result) {
        this.#sendEmail(url);
        // console.log("URL : " , URL);
      }
    } else {
      throw new Error("Password reset route must be defined: /password/:token");
    }
  }

  async resetPassword(email, passeord, passwordConfirmation, callback) {
    const passwordResetConfig = auth.password_reset[this.#passwordReset];
    const { provider } = auth.guards[this.#passwordReset];
    const model = auth.providers[provider];

    const resetRequest = await PasswordRestToke.findOne({
      where: { email: email },
    });

    if (Date.now() <= resetRequest.expires_at) {
      const user = await model.findOne({ where: { email: email } });
      if (passeord === passwordConfirmation) {
        await resetRequest.destroy();
        callback(user, password);
        // return user;
      } else {
        throw new Error("Password confirmation Error");
      }
    } else {
      throw new Error("Token Expired"); //Important Step
    }
  }

  #sendEmail(url) {
    const { expired_after } = auth.password_reset[this.#passwordReset];
    console.log("URL : ", url); //URL :  http://localhost:5000/854b977fa9013f2edcb7a75383249a5f408403bc1226a627ff2c74d9f99cbf6d?email=9db096ff2660cf63c038fade7ce25a90e0b83b33de2496aff15d6d0cbff6663bMA
    Mailer.instance
      .to("isaackamel123456789@gmail.com")
      .from("isaackamel12345@gmail.com")
      .subject("Reset Password Request")
      .text(`Password Reset Request`)
      .message(passwordResetEmail(url,expired_after))
      .send();
  }
};
//وظيفتها الاساسية توليد ال يو ار ال  تعبنا //generateUrl()
//http://www.something.com/TOKEN?email=email@app.com //بنستخدم الايمبل في جلب المستخدم من الداتا بيز اما التوكن بكون مشفر
//http://www.something.com/TOKEN?email=HASH_EMAIL  // في ناس بتشفر الايمل وفي لا
//لما ينضغط اليو ار ال بروح يتاكد ازا في توكن في السيستم ولدت التوكن هادي وبعدين بتاكد انو التوكن الي موجودة في الداتا بيز مش اكسبيرد وبعدين بجيب الايميل الي مخزن في الداتا بيز وبيتاكد انو نفس الهاشد الايميل الموجود في الرابط


//in the wep after log in a session is created  in an API after login a token is created , the token has a secret to check if this token is generated by this secret or not 