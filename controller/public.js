import Animation from "../model/animation.js";
import Staff from "../model/staff.js";
import Bd from "../model/bd.js";
import User from "../model/user.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import * as crypto from "crypto";

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
    Animation.findById(req.params.id).populate("recensioni.user").populate("staffs").then(anim => {
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
    res.render("home.ejs", {
        errorType: "",
        errorString: "",
    });
};

const postSignUp = (req, res, next) => {
    User.find({email: req.body.email}).then(result => {
        if(result.length != 0){
            res.render("home.ejs", {
                errorType: "sign",
                errorString: "E-mail già presente"
            });
        } else { //email non presente, verifichiamo username
            User.find({username: req.body.user}).then(result => {
                if(result.length != 0){
                    res.render("home.ejs", {
                        errorType: "sign",
                        errorString: "Username già presente"
                    });
                } else { //username non presente, passiamo a salvare l'utente nel db
                    let transporter = nodemailer.createTransport({
                        host: "email-smtp.eu-north-1.amazonaws.com",
                        port: 465,
                        secure: true, 
                        auth: {
                          user: process.env.USEREMAIL, 
                          pass: process.env.PASSEMAIL,
                        }
                    });
                    
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if(err){
                            console.log(error);
                            return;
                        }
                
                        crypto.randomBytes(32, (err, buffer) => {
                            if(err)
                                console.log(err);

                            const token = buffer.toString("hex");

                            const user = new User({
                                email: req.body.email,
                                username: req.body.user,
                                password: hash,
                                nome: req.body.nome,
                                cognome: req.body.cognome,
                                dataNascita: new Date(req.body.dataNascita),
                                indirizzo: {
                                    città: req.body.city,
                                    via: req.body.via,
                                    CAP: req.body.cap
                                },
                                tipo: "user",
                                verificato: false,
                                datiVerifica: {
                                    codice: token,
                                    scadenza: Date.now() + 30 *60000//60000 per convertire minuti in ms
                                }
                            });

                            user.save().then(user => {
                                transporter.sendMail({
                                    from: '"MiraiAnimation" joseph81106@gmail.com',
                                    to: user.email,
                                    subject: "Verify your account",
                                    text: "Hello" + user.username + "\nPlease verify your account: " + "https://www." + req.hostname + ":" + process.env.PORT + "/signup/" + user.datiVerifica.codice,
                                    html: '<h2>Hello' + user.username + '</h2>Please verify your account: <a href="' + req.protocol + '://' + req.hostname + ":" + process.env.PORT + "/signup/" + user.datiVerifica.codice + '">Verifica account</a>'
                                });
    
                                res.redirect("/");
                            }).catch(err => {
                                console.log(err);
                            });
                        });

                    });
                }
            });
        }
    });
};

const getVerify = (req, res, next) => {
    const token = req.params.token.trim();

    User.findOne({"datiVerifica.codice": token}).then(user => {
        if(user.datiVerifica.scandenza < new Date())
            return;
        
        user.verificato = true;
        user.datiVerifica = null;
        user.save().then(user => {
            if(req.session.user)
                req.session.user = user;
            
            res.redirect("/");
        }).catch(err => {
            console.log(err);
        });

    }).catch(err => {
        console.log(err);
    });
};

const postLogIn = (req, res, next) => {
    User.findOne({username: req.body.username}).then(user => {
        if(!user){
            return res.render("home.ejs", {
                errorType: "log",
                errorString: "Utente o password errata"
            });
        }

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err || !result){
                return res.render("home.ejs", {
                    errorType: "log",
                    errorString: "Utente o password errata"
                });
            }

            req.session.user = user;

            res.redirect("/");
        });
    }).catch(err => {
        console.log(err);
    });
};


export {getAnimation, getStaff, getShop, getAnimationPage, getHome, postSignUp, getVerify, postLogIn};

