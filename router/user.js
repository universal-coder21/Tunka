const express=require("express");
const app=express();
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js")


router.route("/signup")
.get(userController.renderSignuoform)
.post(userController.signUp);

// log in route


router.route("/login")
.get(userController.logIn)
.post( saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),
    userController.postLogin)

//log out route
router.get("/logout",userController.logout);

module.exports=router;