import {Router} from 'express'
import {checkToken, createUser, loginUser} from "../middlewaares/user-middleware.js"
import {users, refreshTokens} from "../data/user.js"
import jwt from "jsonwebtoken"

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
    const user = req.session.user;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push({ refreshToken, login: user.login });

    res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30*60*1000
    }).redirect("/");
});

userRoutes.route("/refresh")
//.get((req,res)=> {res.json("get refrash")})
.post((req, res) => {
    const userLogin = req.body.login;
    const serverStoredToken = refreshTokens.find(rt => rt.login === userLogin);
    const redirectUrl = req.query.redirect || '/';

    if (!serverStoredToken) {
        return res.status(403).json({ message: "Access denied" });
    }

    jwt.verify(serverStoredToken.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        const newAccessToken = generateAccessToken({ login: user.login });
        res.cookie("jwt", newAccessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 30*60*1000
        }).redirect(redirectUrl);
    });
});

userRoutes.get("/logout", (req, res) => {
    //console.log("USER");
    //console.log(req.session.user);
    
    if (req.session) req.session.destroy();
    
    res.clearCookie("jwt").redirect("/");
});

userRoutes.route("/signup")
.get((req,res)=> {res.render("form_register")})
.post(createUser, (req,res) => {
    req.session.user = {
        login: req.body.login,
        email : req.body.email,
        password: req.body.password
    };
    //console.log(req.session.user);
    users.push(req.session.user);
    res.cookie("jwt", generateAccessToken(req.session.user), {
        httpOnly: true,
        secure: true,
        maxAge: 30*60*1000
    }).redirect("/");
});

userRoutes.route("/testJWT")
.get(checkToken, (req,res) => {
    res.json("testJWT works!");
})


const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "30m"});
}

const generateRefreshToken = (user) => {
    const newToken =jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn : "30d"});
    return newToken;
}

export default userRoutes;