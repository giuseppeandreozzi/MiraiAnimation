import Animation from "../model/animation.js";
import Staff from "../model/staff.js";
import Bd from "../model/bd.js";

const getAnimation = (req, res, next) => {
    Animation.find().then(animations => {
        res.render("animation.ejs", {
            animations: animations
        });
    }).catch(err => {
        console.log(err);
    });
};

const getStaff = (req, res, next) => {
    Staff.find().then(staffs => {
        res.render("staff.ejs", {
            staffs: staffs
        });
    }).catch(err => {
        console.log(err);
    });
};

const getAnimationPage = (req, res, next) => {
    Animation.findById(req.params.id).then(anim => {
        res.render("animationPage.ejs", {
            animation: anim
        });
    }).catch(err => {
        console.log(err);
    });
};

const getShop = (req, res, next) => {
    Bd.find().populate("animazione").then(bds => {
        res.render("shop.ejs", {
            bds: bds
        });
    }).catch(err => {
        console.log(err);
    });

};

const getHome = (req, res, next) => {
    res.render("home.ejs");
};

export {getAnimation, getStaff, getShop, getAnimationPage, getHome};

