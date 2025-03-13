const express = require("express");
const router = express.Router();

router.get("/not-found",(req,res, next)=>{
    res.render("layouts/errors/404-error")
});

router.get("/service-unavailable",(req,res, next)=>{
    res.render("layouts/errors/503-error")
});

//منطقيا غير مضطرين للروابط هدول الريندر بتادي الغرض بس هدول زي تجميع للايرورز

module.exports = router;