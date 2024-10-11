import {users} from '../data/user.js'
import bcrypt from "bcrypt"
import validator from 'validator';

export const checkUser = (req, res, next)=> {
    // if(req.cookies && req.cookies.user){
    //     res.locals.user = req.cookies.user;
    // }
    if(req.session && req.session.user){
        res.locals.user = req.session.user.login;
    }
    next ();
}

export const loginUser = (req,res, next) => {
    const { login, password } = req.body;
    
    const user = users.find(u => u.login === login);
    if (!user) {
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
                password: hash

            });
            next();
            return;
        }
        res.status(400).redirect('/');
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