import express from "express";
import Animation from "../model/animation.js";
import Staff from "../model/staff.js";

const publicRoutes = express.Router();

publicRoutes.get("/animation", (req, res, next) => {
    Animation.find().then(animations => {
        res.render("animation.ejs", {
            animations: animations
        });
    }).catch(err => {
        console.log(err);
    });

});

publicRoutes.get("/staff", (req, res, next) => {
    Staff.find().then(staffs => {
        res.render("staff.ejs", {
            staffs: staffs
        });
    }).catch(err => {
        console.log(err);
    });
});

publicRoutes.get("/shop", (req, res, next) => {
    res.render("shop.ejs");
});

publicRoutes.get("/animationPage", (req, res, next) => {
    Animation.findById(req.query.anim.trim()).then(anim => {
        res.render("animationPage.ejs", {
            animation: anim
        });
    }).catch(err => {
        console.log(err);
    });
});

publicRoutes.get("/", (req, res, next) => {
    res.render("home.ejs");
});

export default publicRoutes;