import User from "../model/user.js";
import * as path from "path";
import Animation from "../model/animation.js";

const getPannelloAnimazioni = (req, res, next) => {
    Animation.find().then(animations => {
        res.render(path.join("admin", "manageAnimation"), {
            animations: animations
        });
    });

};

const getPannelloStaff = (req, res, next) => {
    res.render(path.join("admin", "manageStaff"), {

    });
};

const getPannelloBD = (req, res, next) => {
    res.render(path.join("admin", "manageBD"), {

    });
};

const getPannelloUtenti = (req, res, next) => {
    res.render(path.join("admin", "manageUser"), {

    });
};

const postInfoAnimazione = (req, res, next) => {
    Animation.findById(req.body.codiceAnimazione).then(anim => {
        res.json(anim);
    }).catch(err => {
        console.log(err);
    });
};

const postModificaAnimazione = (req, res, next) => {
    Animation.findById(req.body._id).then(anim => {
        anim.titolo = req.body.titolo;
        anim.genere = req.body.genere;
        anim.tipo = req.body.tipo;
        anim.dataUscita = req.body.dataUscita;
        anim.immagine = (req.file) ? req.file.buffer : anim.immagine;

        anim.save().then(anim => {
            res.redirect("pannelloAnimazioni");
        })
    });
};

export {getPannelloAnimazioni, getPannelloStaff, getPannelloBD, getPannelloUtenti, postInfoAnimazione, postModificaAnimazione};