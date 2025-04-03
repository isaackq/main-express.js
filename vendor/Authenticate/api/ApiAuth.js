const jwt = require("jsonwebtoken");
const AuthClient = require("../models/AuthClient");
const crypto = require("crypto");
const Auth = require("../../../services/Authenticate");
const { auth } = require("../../../config/auth");
const AccessToken = require("../models/AccessToken");
const { where } = require("sequelize");

/**
 * Generate Token
 * - Create Token
 *
 *
 *
 */
class ApiAuth {
  static #instance = null; //should  be private to not conflict with the getter

  // static get instance() {
  //   if (this.instance != null) {
  //     return this.instance;
  //   } else {
  //     this.instance = new ApiAuth();
  //     return this.instance;
  //   }
  // }

  static get instance() {
    return (this.#instance ??= new ApiAuth());
  }

  useApiAuth(model) {
    model.prototype.createToken = async function (
      name,
      revokePrevious = false
    ) {
      // let modelProvider = null;
      // const providers = auth.providers;
      // for (const provider in providers) {
      //   // for in is used when we whant to loop over an object it returns the keys if the object
      //   if (providers[provider].model == model) {
      //     modelProvider = providers[provider];
      //     console.log(providers[provider]);
      //     break;
      //   }
      // }

      const guard = Auth.getGuard(model);
      console.log(guard);
      const provider = auth.guards[guard].provider; //بنجيب البروفايدر لانو الكلايانت تابع له
      const client = await AuthClient.findOne({
        where: { provider: provider, revoked: false },
      });
      if (client) {
        // the secret is the key  of the encrypiton
        const token = jwt.sign({ id: this.id }, client.secret); //payload is a data that put into the generated token to garntee that there is a pointer to the user who generated the token
        // console.log(token /*.split('.')[2]*/); //عشان نجيب السيقناتشر بكون الي في الاخر وكلهم مفصولين بالدوت
        const signature = token.split(".")[2];
        const milliSeconds = 30 * 60 * 60 * 1000; //the duration in ms for 30 days
        const expiredAfter = Date.now() + milliSeconds;
        if (revokePrevious /*== false*/) {
          // if true revoke the previous tokens  // Revoke any previous tokens(sessions) from other devices
          await AccessToken.update(
            { revoked: true },
            {
              where: { client_id: client.id, user_id: this.id },
            }
          );
        }
        await AccessToken.create({
          name: name,
          expires_at: expiredAfter,
          user_id: this.id,
          client_id: client.id,
          signature: signature,
        });
        return token;
      }
      throw new Error(
        "No active AuthClient found for the specified provider." ||
          "Undefined Client"
      );

      //ازا كان بنفع نفس المستخدم يسجل دخول من اكتر من مكان معناتو لازم يكون في اكتر من اكسيس توكن  لنفس المسنخدم باستخدام نفس الكلاينت
      /**
       * - Select target provide auth client from db
       * - Get the secret to create token
       * - Return Token
       */
    }; //function has a referance to the model , the arrow function has referance to the class

    model.prototype.logout = async function () {
      // console.log(this.getDataValue('token'));//لانها اضيفت افتراضيا
      // console.log(this.token);
      const accessToken = await this.token.update({ revoked: true }); //return acess token
      return accessToken != null || undefined;//the access token does not equal null or undifined 
    };
  }

  async createClient(name, provider) {
    const count = await AuthClient.count({ where: { name: name } });
    if (count == 0) {
      await AuthClient.create({
        name: name,
        provider,
        secret: this.#generateToken(),
      });
    }
    //revoked is false by default
  }

  #generateToken() {
    const token = crypto.randomBytes(32).toString("hex"); //نحول ال 32 بايت ل هكاسا ديسيميل
    return crypto.createHash("sha256").update(token).digest("hex"); //الاقوريثيمز تبعت التشفير  // برجع قيمة التشفير بالهكسا ديسيميل
  }
}

module.exports = ApiAuth;

// exports.createToken = () => {
//   const token = jwt.sign({ id: 1 }, process.env.APP_KEY);
//   console.log(token);
// };

// exports.verifyToken = (token) => {
//   const result = jwt.verify(token, process.env.APP_KEY);
//   console.log(result); //{ id: 1, iat: 1742813628 } //instantiated at وقت محدد
// };

// const obj = { a: 1, b: 2, c: 3 };

// for (const key in obj) {
//   console.log(key);       // a, b, c
//   console.log(obj[key]);  // 1, 2, 3
// }

// const arr = ["a", "b", "c"];

// for (const i in arr) {
//   console.log(i);       // 0, 1, 2 (indexes)
// }

// for (const val of arr) {
//   console.log(val);     // a, b, c (values)
// }
