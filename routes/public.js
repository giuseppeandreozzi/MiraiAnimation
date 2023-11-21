import express from "express";

const publicRoutes = express.Router();

publicRoutes.get("/animation", (req, res, next) => {
    res.render("animation.ejs");
});

publicRoutes.get("/staff", (req, res, next) => {
    res.render("staff.ejs");
});

publicRoutes.get("/shop", (req, res, next) => {
    res.render("shop.ejs");
});

publicRoutes.get("/animationPage", (req, res, next) => {
    res.render("animationPage.ejs");
});

publicRoutes.get("/", (req, res, next) => {
    res.render("home.ejs");
});

export default publicRoutes;