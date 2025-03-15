/**
 * 1- Retreve the req
 * 2- Get params and query params from the req
 * 3- Check the data of expires_at value if not expired?
 *    - Get the token
 *    - make a query on password_reset_tokens table using token
 *    - validate the expiration date
 *    - if not expired , continue //الوقت الي بكون في الجدول وقت مستقبلي بنقارنو ازا اقل او يساوي الحالي
 * 4- Check email hash(Digital Signature)
 *    - Email : req.query.email (Hashed)
 *       - DB :email(Not Hashed)
 *       - Hash DB email and compare HASH with HASH
 * 5- if pass on comparing, then allow password reset
 * 6- Remove the row after password has been reset successfully
 */

const PasswordRestToke = require("../models/PasswodeResetToken");
const crypto = require("crypto");

exports.signedResetToken = async (req, res, next) => {
  const token = req.params.token;
  const hashedEmail = req.query.email;
  const resetRequest = await PasswordRestToke.findOne({
    //we can do it nested without await
    where: { token: token },
  });

  if (resetRequest != null) {
    //in evry save we do new URL GENERATED
    if (Date.now() <= resetRequest.expires_at) {
      //enure that the url time does not end
      const requestHashedEmail = crypto.createHash("sha256") //تشفير الايميل الموجود في قاعدة البيانات لمقارنته مع الايميل المشفر الموجود في الرابط
        .update(resetRequest.email)
        .digest("hex"); //تشفير الايميل
      if (requestHashedEmail === hashedEmail) {
        return next();
      } else {
        throw new Error("Rejected URL , unsecured email hash"); //مؤقتا
        // return res.render("/.");
      }
    } else {
      throw new Error("Expired request time, Forbidden");
    }
  } else {
    throw new Error("Invalid Reset Token, Rejected");
  }
};
