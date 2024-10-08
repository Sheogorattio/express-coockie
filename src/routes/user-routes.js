import {Router} from 'express'
import session from 'express-session';
import validator from 'validator';
import bcrypt from "bcrypt"

const userRoutes = Router();

userRoutes.get("/signup", (req,res)=> {res.render("form_register")});
userRoutes.get("/signin", (req,res)=> {res.render("form_auth")});
userRoutes.get("/logout", (req,res)=> {
    console.log(req.session.user)
    req.session.destroy(); 
   // console.log(req.session.user)
    res.redirect("/")
});

userRoutes.route("/signup")
.get((req,res)=> {res.render("form_register")})
.post(async (req,res) => {
    console.log(req.body);
    // res.cookie("user", req.body.login, {
    //     httpOnly: true,
    //     maxAge: 2000000,
    // });
    const body = req.body;
    const reExp = new RegExp('^(?=.*\\w)(?=.*\\W)(?=.*\\d).{8,}');
    if(validator.isEmail(body.email) && body.password == body.confirm_password && reExp.test(body.password)){
        req.session.user = {
            login: body.login,
            email: body.email,
            password: await hashPassword(body.password),
        }
        // console.log(req.session.cookie)
        // console.log(req.session.user)
        res.redirect("/");
    }
    else{
        console.log("Invalid password");
        res.redirect("signup");
    }
});

async function hashPassword(password) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

export default userRoutes;