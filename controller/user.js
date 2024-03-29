import User from "../model/user.js";
import Animation from "../model/animation.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import * as crypto from "crypto";
import Stripe from "stripe";
import bd from "../model/bd.js";
import * as Mongoose from "mongoose";
import * as path from "path";
import PDF from "pdfkit";
import {validationResult} from "express-validator";

const getLogOut = (req, res, next) => {
    req.session.destroy(err => {
        if(err)
            next(err);

        res.redirect("/");
    });
};

const getReset = (req, res, next) => {
    let transporter = nodemailer.createTransport({
        host: "email-smtp.eu-north-1.amazonaws.com",
        port: 465,
        secure: true, 
        auth: {
          user: process.env.USEREMAIL, 
          pass: process.env.PASSEMAIL,
        }
    });

    crypto.randomBytes(32, (err, buffer) => {
        if(err)
            next(err);

        const token = buffer.toString("hex");

        User.findById(req.session.user._id).then(user => {
            user.datiVerifica = {
                codice: token,
                scadenza: Date.now() + 30 *60000//60000 per convertire minuti in ms
            };

            
    
            user.save().then(user => {
                transporter.sendMail({
                    from: '"MiraiAnimation" joseph81106@gmail.com',
                    to: user.email,
                    subject: "Reset password",
                    text: "Hello" + user.username + "\nEcco il link per resettare la password: "  + req.hostname + ":" + process.env.PORT + "/resetPassword/" + user.datiVerifica.codice,
                    html: '<h2>Hello ' + user.username + '</h2>Ecco il link per resettare la password: <a href="' + req.protocol + '://'  + req.hostname + ':' + process.env.PORT + '/resetPassword/' + user.datiVerifica.codice +'">Resetta password</a>'
                });
    
                res.redirect("/");
            }).catch(next);

        }).catch(next);
    });
};

const getResetPassword = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()){
        return res.redirect("/");
    }

    User.findOne({"datiVerifica.codice": req.params.codice}).then(user => {
        if(user.datiVerifica.scadenza > new Date()){
            res.render("user/resetPassword.ejs", {
                errorString: null,
                _id: user._id,
                success: null
            });
        } else  
            res.redirect("/");
    }).catch(next);
};

const postResetPassword = (req, res, next) => {
    User.findById(req.body._id).then(user => {
        let error = validationResult(req);
        if(!error.isEmpty()){
            return res.render("user/resetPassword.ejs", {
                _id: user._id,
                errorString: error.errors.msg,
                success: null
            });
        }

        bcrypt.compare(req.body.oldPassword, user.password, (err, result) => {
            if(err || !result){
                res.render("user/resetPassword.ejs", {
                    _id: user._id,
                    errorString: "Controllare la vecchia password",
                    success: null
                });
            }

            bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                if(err)
                    next(err);

                user.password = hash;

                user.save().then(() => {
                    req.session.destroy();

                    res.render("user/resetPassword.ejs", {
                        errorString: null,
                        success: "Password cambiata con successo"
                    });
                }).catch(next);;
            });
        });
    }).catch(next);
};

const getAccount = (req, res, next) => {
    res.render("user/account.ejs", {
        success: "",
        error: ""
    });
};

const postAccount = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        return res.render("user/account.ejs", {
            success: "",
            error: "Valore non valido nel campo " + error.errors[0].path
        });
    }

    User.findById(req.body._id).then(user => {
        user.nome = req.body.nome;
        user.cognome = req.body.cognome;
        user.indirizzo.via = req.body.via;
        user.indirizzo.città = req.body.city;
        user.indirizzo.CAP = req.body.cap;
        user.dataNascita = new Date(req.body.dataNascita);

        user.save().then(user => {
            req.session.user = user;
            res.locals.user = req.session.user;
            res.render("user/account.ejs", {
                success: "Dati modificati con successo",
                error: ""
            });
        }).catch(next);
    }).catch(next);
};
const getCarrello = (req, res, next) => {
    let user = new User(req.session.user);

    user.populate({
        path: 'carrello.prodotto',
        populate: { path: 'animazione' }
    }).then(result => {
        res.render("user/cart", {
            cart: result.carrello
        });
    }).catch(next);
};

const postCarrello = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()) {
        return res.redirect("/shop");
    }

    User.findById(req.session.user._id).then(user => {
        user.carrello.push({
            quantity: req.body.quantity,
            prodotto: req.body.bd,
            prezzo: req.body.prezzo
        });

        user.save().then(user => {
            req.session.user = user;

            res.redirect("/shop");
        }).catch(next);
    }).catch(next);

};

const getCheckout = (req, res, next) => {
    const stripe = new Stripe(process.env.SK_STRIPE);
    let user = new User(req.session.user);

    user.populate({ path: "carrello.prodotto", populate: {path: "animazione"} }).then(result =>{
        let items = [];
        for(el of result.carrello){
            items.push({
                price_data: {
                    currency: "EUR",
                    unit_amount_decimal: el.prezzo * 100,
                    product_data: {
                        name: el.prodotto.animazione.titolo,
                        description: el.prodotto.descrizione,

                    }
                },
                quantity: el.quantity,
            });
        }

        stripe.checkout.sessions.create({
            line_items: items,
            mode: 'payment',
            success_url: req.protocol + '://'  + req.hostname + ':' + process.env.PORT + '/checkoutSuccess/',
            cancel_url: req.protocol + '://'  + req.hostname + ':' + process.env.PORT + '/',
          }).then(session => {
            res.status(303).redirect(session.url);
          }).catch(next);
    });


};

const getCheckoutSuccess = (req, res, next) => {
    User.findById(req.session.user._id).then(user =>{
        let arr = [];

        for(el of user.carrello){
            arr.push({
                quantity: el.quantity,
                prodotto: el.prodotto,
                prezzo: el.prezzo
            });
        }

        user.ordini.push({
            prodotti: arr,
            dataOrdine: new Date(),
            numeroOrdine: Date.now().toString().slice(-5) + "#" + Math.floor(Math.random() * 100)
        });

        user.carrello = [];

        user.save().then(user => {
            req.session.user = user;
            res.render("user/success");
        }).catch(next);
    }).catch(next);

};

const postDeleteCart = (req, res, next) => {
    User.findById(req.session.user._id).then(user => {
        user.carrello = user.carrello.filter(el => el._id.toString() !== req.body._id);

        user.save().then(user => {
            req.session.user = user;
    
            res.redirect("/carrello");
        });
    }).catch(next);
};

const getOrdini = (req, res, next) => {
    let user = new User(req.session.user);

    user.populate({
        path: "ordini.prodotti.prodotto", 
        populate: {path: "animazione"}
    }).then(user => {
        res.render("user/orders", {
            ordini: user.ordini
        });
    }).catch(next);

};

const getFattura = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()){
        return res.redirect("/ordini");
    }
    const numeroOrdine = decodeURIComponent(req.params.numOrdine);
    const doc = new PDF({
        font: "Helvetica",
        pdfVersion: "1.5", 
        tagged: true,
        info: {
            Title: "Fattura " + numeroOrdine
        },
        displayTitle: true
    });

    var ordine = {}, list = [];
    doc.pipe(res);

    let user = new User(req.session.user);

    user.populate({
        path: "ordini.prodotti.prodotto", 
        populate: {path: "animazione"}
    }).then(user => {
        let prezzoTotale = 0;

        for (let el of user.ordini){
            if(el.numeroOrdine === numeroOrdine){
                ordine = el;
                break;
            }
        }
        
        doc.font("Helvetica-Bold")
            .text("Mittente", 30, 30)
            .font("Helvetica")
            .text("Mirai Animation", 30, 46);

        doc.font("Helvetica-Bold")
            .text("Destinatario", 420, 30)
            .font("Helvetica")
            .text(user.nome + " " + user.cognome, 420, 45)
            .text(user.indirizzo.città, 420, 57)
            .text(user.indirizzo.via + " " + user.indirizzo.CAP, 420, 69);  
        
        doc.rect(220, 15, 160, 100).fill()
            .image(path.join("public", "img", "logo.png"), 200, 15, {fit: [200, 100], align: 'center'})
            .moveDown(2)
            .fontSize(16)
            .text("Fattura ordine N°" + numeroOrdine, 200, 150)
            .moveDown()
            .fontSize(15)
            .font("Helvetica-Bold")
            .text("PRODOTTI", 50, 200)
            .moveDown();
  
        
        for(let el of ordine.prodotti){
            doc.fontSize(13)
                .font("Helvetica-Bold")
                .text(el.prodotto.animazione.titolo)
                .font("Helvetica")
                .fontSize(12)
                .list(["Quantità: " + el.quantity, "Prezzo: " + el.prezzo])
                .moveDown();

            prezzoTotale += el.prezzo;
        }

        doc.fontSize(13)
            .font("Helvetica-Bold")
            .text("Prezzo totale: " + prezzoTotale, {align: 'right'});
        
        doc.end();
    }).catch(next);
};

const postInsertRecensione = (req, res, next) => {
    let error = validationResult(req);
    if(!error.isEmpty()){
        return res.redirect("/animation/" + req.body.codiceAnimazione);
    }

    Animation.findById(req.body.codiceAnimazione).then(anim => {
        anim.recensioni.push({
            user: req.session.user._id,
            voto: req.body.voto,
            commento: req.body.commento
        });

        anim.save().then(() =>{
            res.redirect("/animation/" + req.body.codiceAnimazione);
        });
    }).catch(next);
};
export {getLogOut, getReset, getResetPassword, postResetPassword, getAccount, postAccount, getCarrello, postCarrello, getCheckout, getCheckoutSuccess, 
    postDeleteCart, getOrdini, getFattura, postInsertRecensione};