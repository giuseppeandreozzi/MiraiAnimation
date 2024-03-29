import User from "../model/user.js";
import * as path from "path";
import Animation from "../model/animation.js";
import Staff from "../model/staff.js";
import Bd from "../model/bd.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const getPannelloAnimazioni = (req, res, next) => {
    Animation.find().populate("staffs").then(animations => {
        Staff.find().then(staffs => {
            res.render(path.join("admin", "manageAnimation"), {
                animations: animations,
                staffs: staffs
            });
        }).catch(next);
    });

};

const getPannelloStaff = (req, res, next) => {
    Staff.find().then(staffs => {
        res.render(path.join("admin", "manageStaff"), {
            staffs: staffs,
            errorEdit: "",
            errorInsert: ""
        });
    }).catch(next);
};

const getPannelloBD = (req, res, next) => {
    Bd.find().populate("animazione").then(bds => {
        Animation.find().then(animations => {
            res.render(path.join("admin", "manageBD"), {
                bds: bds,
                animations: animations,
                errorEdit: "",
                errorInsert: ""
            });
        }).catch(next);
    });

};

const getPannelloUtenti = (req, res, next) => {
    User.find().then(users => {
        res.render(path.join("admin", "manageUser"), {
            users: users,
            errorEdit: ""
        });
    }).catch(next);

};

const postInfoAnimazione = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        return res.redirect("/pannelloAnimazioni");
    }

    Animation.findById(req.body.codiceAnimazione).then(anim => {
        res.json(anim);
    }).catch(next);
};

const postModificaAnimazione = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect("/pannelloAnimazioni")
    }
    Animation.findById(req.body._id).then(anim => {
        anim.titolo = req.body.titolo;
        anim.genere = req.body.genere;
        anim.tipo = req.body.tipo;
        anim.dataUscita = req.body.dataUscita;
        anim.immagine = (req.file) ? req.file.buffer : anim.immagine;

        anim.save().then(anim => {
            res.redirect("/pannelloAnimazioni");
        }).catch(next);
    }).catch(next);
};

const postAggiungiAnimazione = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect("/pannelloAnimazioni")
    }

    const anim = new Animation({
        titolo: req.body.titolo,
        genere: req.body.genere,
        tipo: req.body.tipo,
        dataUscita: req.body.dataUscita,
        immagine: req.file.buffer
    });

    anim.save().then(() => {
        res.redirect("/pannelloAnimazioni");
    }).catch(next);
};

const postCancellaAnimazione = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect("/pannelloAnimazioni")
    }

    Animation.findByIdAndDelete(req.body._id).then(() =>{
        res.redirect("/pannelloAnimazioni");
    }).catch(next);
};

const postAggiungiStaffAnimazione = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect("/pannelloAnimazioni")
    }

    Animation.findById(req.body._idAnimazione).then(anim => {
        anim.staffs.push(req.body._idStaff);

        anim.save().then(() => {
            res.redirect("/pannelloAnimazioni");
        }).catch(next);
    }).catch(next);
};

const postEliminaStaffAnimazione = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect("/pannelloAnimazioni")
    }

    Animation.findById(req.body._idAnimazione).then(anim => {
        let index = anim.staffs.indexOf(req.body._idStaff)
        anim.staffs.splice(index, 1);
        
        anim.save().then(() => {
            res.redirect("/pannelloAnimazioni");
        }).catch(next);
    }).catch(next);
};

const postInfoStaff = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        res.redirect("/pannelloStaff")
    }

    Staff.findById(req.body.codiceStaff).then(staff => {
        res.json(staff);
    }).catch(next);
};

const postModificaStaff = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        Staff.find().then(staffs => {
            return res.render(path.join("admin", "manageStaff"), {
                staffs: staffs,
                errorEdit: "Errore nel campo " + error.errors[0].path,
                errorInsert: ""
            });
        }).catch(next);
    }

    Staff.findById(req.body.codiceStaff).then(staff => {
        staff.nome = req.body.nome;
        staff.cognome = req.body.cognome;
        staff.anniServizio = req.body.anniServizio;
        staff.ruolo = req.body.ruolo;
        
        staff.save().then(() => {
            res.redirect("/pannelloStaff");
        }).catch(next);
    }).catch(next);
};

const postInserimentoStaff = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        Staff.find().then(staffs => {
            return res.render(path.join("admin", "manageStaff"), {
                staffs: staffs,
                errorEdit: "",
                errorInsert: "Errore nel campo " + error.errors[0].path
            });
        }).catch(next);
    }

    let staff = new Staff({
        nome: req.body.nome,
        cognome: req.body.cognome,
        anniServizio: req.body.anniServizio,
        ruolo: req.body.ruolo
    });

    staff.save().then(() => {
        res.redirect("/pannelloStaff")
    }).catch(next);
};

const postEliminaStaff = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        return res.redirect("/pannelloStaff");
    }

    Staff.findByIdAndDelete(req.body.codiceStaff).then(() =>{
        res.redirect("/pannelloStaff");
    }).catch(next);
};

const postInfoBd = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        return res.redirect("/pannelloBD");
    }

    Bd.findById(req.body.codiceBD).then(bd => {
        res.json(bd);
    }).catch(next);
};

const postEditBd = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        Bd.find().populate("animazione").then(bds => {
            Animation.find().then(animations => {
                return res.render(path.join("admin", "manageBD"), {
                    bds: bds,
                    animations: animations,
                    errorEdit: "Errore nel campo " + error.errors[0].path,
                    errorInsert: ""
                });
            }).catch(next);
        }).catch(next);
    }

    Bd.findById(req.body.codiceBD).then(bd => {
        bd.prezzo = req.body.prezzo;
        bd.descrizione = req.body.descrizione;
        bd.immagine = (req.file) ? req.file.buffer : bd.immagine;

        bd.save().then(() => {
            res.redirect("/pannelloBD");
        });
    }).catch(next);
};

const postInsertBd = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        Bd.find().populate("animazione").then(bds => {
            Animation.find().then(animations => {
                return res.render(path.join("admin", "manageBD"), {
                    bds: bds,
                    animations: animations,
                    errorEdit: "",
                    errorInsert: "Errore nel campo " + error.errors[0].path
                });
            }).catch(next);
        }).catch(next);
    }

    const bd = new Bd({
        animazione: req.body.codiceAnim,
        descrizione: req.body.descrizione,
        prezzo: req.body.prezzo,
        immagine: (req.file) ? req.file.buffer : null
    });

    bd.save().then(() => {
        res.redirect("/pannelloBD");
    }).catch(next);
};

const postDeleteBd = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        return res.redirect("/pannelloBD");
    }

    Bd.findByIdAndDelete(req.body.codiceBD).then(() => {
        res.redirect("/pannelloBD");
    }).catch(next);
};

const postInfoUtente = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        return res.redirect("/pannelloUtenti");
    }

    User.findById(req.body.codiceUtente).then(user => {
        res.json(user);
    }).catch(next);
}

const postEditUtente = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        User.find().then(users => {
            return res.render(path.join("admin", "manageUser"), {
                users: users,
                errorEdit: "Errore nel campo " + error.errors[0].path
            });
        }).catch(next);
    }

    User.findById(req.body.codiceUtente).then(user => {
        getHashPassword(req.body.password).then(password => {
            user.username = req.body.username;
            user.password = (password) ? password : user.password;
            user.email = req.body.mail;
            user.nome = req.body.nome;
            user.cognome = req.body.cognome;
            user.dataNascita = new Date(req.body.dataNascita);
            user.indirizzo.città = req.body.city;
            user.indirizzo.via = req.body.via;
            user.indirizzo.CAP = req.body.cap;
            user.indirizzo.tipo = req.body.tipo;

            user.save().then(() => {
                res.redirect("/pannelloUtenti")
            }).catch(next);
        }).catch(next);

    }).catch(next);
};

async function getHashPassword(password) {
    if(password !== ""){
        return bcrypt.hash(password, 10, (err, hash) => {
            if(err)
                throw new Error("Errore creazione hash password")

            return hash;
        });
    } else 
        return "";
}

const postDeleteUtente = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        return res.redirect("/pannelloUtenti");
    }

    User.findByIdAndDelete(req.body.codiceUtente).then(() => {
        res.redirect("/pannelloUtenti")
    }).catch(next);
};

export {getPannelloAnimazioni, getPannelloStaff, getPannelloBD, getPannelloUtenti, postInfoAnimazione, postModificaAnimazione, postAggiungiAnimazione,
    postCancellaAnimazione, postAggiungiStaffAnimazione, postEliminaStaffAnimazione, postInfoStaff, postModificaStaff, postInserimentoStaff,
    postEliminaStaff, postInfoBd, postEditBd, postInsertBd, postDeleteBd, postInfoUtente, postEditUtente, postDeleteUtente};