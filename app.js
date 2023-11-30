import express from "express";
import 'dotenv/config';
import * as path from "path";
import * as mongoose from "mongoose";
import publicRoutes from "./routes/publicRoutes.js";
import session from "express-session";

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

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
  });

app.use(publicRoutes);

mongoose.connect(process.env.DB_LINK).then(() => {
    app.listen(3030);
    console.log("Avviato")
});