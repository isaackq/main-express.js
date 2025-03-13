// @ts-check
// let s = 1 ;
//  s= "sdfs";
exports.sessionErorrs = (req, res, next) => {

  // const errors = req.session.errors;
  // const old = req.session.old;

  // req.session.errors = null;
  // req.session.old = null;


  // if (errors != null && old != null) {
  //   res.locals.errors = errors;
  //   res.locals.old = old;
  // }

  //بتقرا من الفلاش وبتضيف على اللوكالز وبعد متضيف بتفرغ الفلاش 
  // وكمان عشان لو  ضفت على اللوكل بعد كل ويذ حيصير تفريغ كل مرة وحتروح البيانات    لانو هادي بتشتغل بعد الريدايركت يعني كان كل بعد ريدايركت بصير فلش 
  if ("flashed" in req.session && typeof req.session.flashed ==="object") {//عملنا هيك عشان ايش منضيف برة منعدلش اشي هان يكون  الميدل وير ثابت
    res.locals= req.session.flashed;
    req.session.flashed =undefined;
  }
  next();
};
//حققنا scaleapility and useability

//لما نزلنا السيشن ضفنا السيشن للريس 
//لما نزلنا الاي جي اس ضفنا ال لوكالس للريس 
//ف بدنا نضيف اشي احنا لليرسبونس 