const User=require("../models/user");

module.exports.renderSignuoform=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signUp=async(req,res,next)=>{
    try{
       let {username, email,password}=req.body;
       const newUser=new User({email, username});
       const registerUser=await User.register(newUser,password);
       console.log(registerUser);
       req.logIn(registerUser,(err)=>{
           if(err){
               return next();
           }
           req.flash("success",`hi ${username} welcome to Wanderlust`);
           res.redirect("/listing");
       })
    } catch(e){
       req.flash("error",e.message);
       res.redirect("/signup");
    }
   }

   module.exports.logIn=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.postLogin=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are succcessfully logged out")
        res.redirect("/listing");
    })

}