import express from "express";
import 'dotenv/config';
import * as path from "path";
import * as mongoose from "mongoose";
import publicRoutes from "./routes/publicRoutes.js";
import session from "express-session";
import csurf from "csurf";
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))

app.set("view engine", "ejs");
app.set("views", "views");

app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false
}));

app.use(csurf({ cookie: false }));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.csrf = req.csrfToken();
    next();
  });

app.use(publicRoutes);
app.use(userRoutes);
app.use(adminRoutes);

mongoose.connect(process.env.DB_LINK).then(() => {
    app.listen(3030);
    console.log("Avviato")
});