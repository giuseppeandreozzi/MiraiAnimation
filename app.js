import express from "express";
import 'dotenv/config';
import * as path from "path";
import * as mongoose from "mongoose";
import publicRoutes from "./routes/publicRoutes.js";
import session from "express-session";
import { csrfSync } from "csrf-sync";
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js";

const isLoggedIn = (req, res, next) => {
  if (!req.session.user)
    throw new Error("Non autorizzato");

    next();
};

const isAdmin = (req, res, next) => {
  if (req.session.user.tipo !== "admin")
    throw new Error("Non autorizzato");

    next();
};

const app = express();
const csrf = csrfSync({
    getTokenFromRequest: (req) => {
        if (req.is("multipart")) {
          return req.query._c;
        }

        return req.body["_csrf"];
      }
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))

app.set("view engine", "ejs");
app.set("views", "views");

app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false
}));

app.use(csrf.csrfSynchronisedProtection);

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.csrf = req.csrfToken();
    next();
  });

app.use(publicRoutes);
app.use(isLoggedIn, userRoutes);
app.use(isLoggedIn, isAdmin, adminRoutes);

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).render("error");
});

mongoose.connect(process.env.DB_LINK).then(() => {
    app.listen(3030);
    console.log("Avviato")
});