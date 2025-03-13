const { maintainance } = require("../config/maintainance");
const express = require("express");
const Route = require("../services/Route");

// exports.preventDuringMaintaunance = (req, res, next) => {
//   //    console.log(req.url,Route.isRouteExists(req.url),maintainance.status);
//   // console.log(express.Router);//مكونات الاكسبرس فنكشن انستانس //مكونات الراوتر
//   // console.log(express.Router().stack);//الروابط الي جوا انستانس الراوتر من الاكسبرس
//   if (maintainance.status /*  && Route.isRouteExists(req.url)*/) {
//     //الترتيب فوق مهم عشان لو كان المينتينانس فاضي ميعملش لوب علفاضي
//     if (!maintainance.exceptionalDomains.includes(req.url)) {
//       //ازا كان الرابط الي اجانا مش من ضمن الروابط الاستثنائية
//       //يعني في حالة الشت داون لازم باقي الروابط تكون مش شغالة
//       return res.render("layouts/errors/503-error"); //ازا كان الرابط موجود ومش في الاكسبشنال دومين هات ايرورو 503
//       // res.redirect("/");//لما نكون عاملين ري دايركت ويكون الرابط مش موجود بضل يعمل زي لوب لا نهائي
//       // return res.redirect("/err/service-unavailable")//بشتغلش مش عارف ليش
//     }
//   }
//   // else{return  res.render("layouts/errors/404-error");}
//   next();
// };

exports.preventDuringMaintaunance = (req, res, next) => {
//   console.log(req.url, Route.isRouteExists(req.url), maintainance.status);

  if (maintainance.status) {
    if (Route.isRouteExists(req.url)) {
      if (!maintainance.exceptionalDomains.includes(req.url)) {
        return res.render("layouts/errors/503-error");
      }
    } else {
      return res.render("layouts/errors/404-error");
    }
  }

  next();
};
