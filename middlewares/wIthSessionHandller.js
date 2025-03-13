exports.withSessionHandler= (req , res , next )=>{
    res.with= (key,value)=> {
        //ازا كانت الفلاش مش في السيشن عرفها    
    if (!("flashed" in req.session)) {//لازم عشان اكتر من ويذ 
        req.session.flashed = {}
    }
    const flashed =req.session.flashed;
    req.session.flashed = {...flashed ,[key] : value}
    return res ;
}
    next();
}