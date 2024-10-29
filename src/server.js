import express from "express"
import exphbs from "express-handlebars"
import cookieParser from "cookie-parser"
import session from "express-session"
import path from "path"
import {checkUser} from "./middlewaares/user-middleware.js"
import "dotenv/config"
import siteRoutes from './routes/site-routes.js'
import userRoutes from './routes/user-routes.js'


const PORT =  process.env.PORT || 3000;
const hbs = exphbs.create(
    {   
        defaultLayout: "main",
        extname: "hbs"
    }
)
const app = express();
app.use(express.static("photos"));
app.use(express.static("public"));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join("src","views"));


app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
}));
app.use(checkUser);
app.use(express.urlencoded({extended: true}));
app.get("/", (req,res)=> {res.render("home")})
app.use(siteRoutes)
app.use("/user", userRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is running http://localhost:${PORT}`);
})