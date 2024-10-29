import {users} from '../data/user.js'
import bcrypt from "bcrypt"
import validator from 'validator';
import jwt from "jsonwebtoken";
import path from "node:path"

export const checkUser = (req, res, next)=> {
    // if(req.cookies && req.cookies.user){
    //     res.locals.user = req.cookies.user;
    // }
    if(req.session && req.session.user){
        res.locals.user = {login: req.session.user.login, image:req.session.user.image};
    }
    next ();
}

export const loginUser = (req,res, next) => {
    const { login, password } = req.body;
    
    const user = users.find(u => u.login === login);
    if (!user) {
        console.log(users)
        return res.status(400).send('User does not exist');
    }
    
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Invalid password');
    }
    
    next();
}

export const createUser = (req, res, next)=>{
    const reExp = new RegExp('^(?=.*\\w)(?=.*\\W)(?=.*\\d).{8,}');
    if(req.body && 
        req.body.login &&
         req.body.email &&
          req.body.password &&
           req.body.confirm_password &&
            req.body.confirm_password === req.body.password &&
             reExp.test(req.body.password) &&
                 validator.isEmail(req.body.email)){
        const {login, email, password} = req.body;
        const user = users.find(n => n.login === login || n.email === email);
        if(!user){
            const hash = hashPassword(password);
            users.push({
                id: users.length+1,
                login: login,
                email: email,
                password: hash,
                image : req.file.filename

            });
            console.log(users);
            console.log("CREATE USER with file:", req.file); 
            next();
            return;
        }
        res.status(400).redirect('/');
    }
}

export const checkToken = (req,res,next)=> {
    const userToken = req.cookies.jwt;
    if (!userToken) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const decodedInfo = jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);
       
        next();
    } catch (err) { 
        console.log("jwt.verify error\n" +err.message);
        const redirectUrl = req.originalUrl;
        res.redirect(`/user/refresh`);
    }
}

 function hashPassword(password) {
    try {
        const saltRounds = bcrypt.genSaltSync(10);
        const hashedPassword =  bcrypt.hashSync(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}