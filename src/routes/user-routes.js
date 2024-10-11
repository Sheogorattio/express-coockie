import {Router} from 'express'
import {createUser, loginUser} from "../middlewaares/user-middleware.js"
import {users} from "../data/user.js"

const userRoutes = Router();

userRoutes.route('/')
.get((req,res)=>{
    res.json(users);
})

userRoutes.route("/signin")
.get((req,res)=> {res.render("form_auth")})
.post(loginUser, (req, res) => {
    console.log(req.body.login);
    req.session.user = {
        login: req.body.login,
        password: req.body.password
    };
    res.redirect("/");
});

userRoutes.get("/logout", (req,res)=> {
    console.log(req.session.user)
    if(req.session) req.session.destroy(); 
   // console.log(req.session.user)
    res.redirect("/")
});

userRoutes.route("/signup")
.get((req,res)=> {res.render("form_register")})
.post(createUser, (req,res) => {
    req.session.user = {
        login: req.body.login,
        password: req.body.password
    };
    res.redirect("/");
});


export default userRoutes;