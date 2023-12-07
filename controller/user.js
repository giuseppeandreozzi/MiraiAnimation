import User from "../model/user.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import * as crypto from "crypto";
import Stripe from "stripe";
import bd from "../model/bd.js";

const getLogOut = (req, res, next) => {
    req.session.destroy(err => {
        if(err)
            console.log(err);

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
            console.log(err);

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
            }).catch(err => {
                console.log(err);
            });

        }).catch(err => {
            console.log(err);
        });
    });
};

const getResetPassword = (req, res, next) => {
    User.findOne({"datiVerifica.codice": req.params.codice}).then(user => {
        if(user.datiVerifica.scadenza > new Date()){
            res.render("user/resetPassword.ejs", {
                errorString: null,
                _id: user._id,
                success: null
            });
        } else  
            res.redirect("/");
    }).catch(err => {
        console.log(err);
    });
};

const postResetPassword = (req, res, next) => {
    User.findById(req.body._id).then(user => {
        bcrypt.compare(req.body.oldPassword, user.password, (err, result) => {
            if(err || !result){
                res.render("user/resetPassword.ejs", {
                    _id: user._id,
                    errorString: "Controllare la vecchia password",
                    success: null
                });
            }

            bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                user.password = hash;

                user.save().then(() => {
                    req.session.destroy();

                    res.render("user/resetPassword.ejs", {
                        errorString: null,
                        success: "Password cambiata con successo"
                    });
                });
            });
        });
    }).catch(err => {
        console.log(err);
    });
};

const getAccount = (req, res, next) => {
    res.render("user/account.ejs", {
        success: ""
    });
};

const postAccount = (req, res, next) => {
    User.findById(req.body._id).then(user => {
        user.nome = req.body.nome;
        user.cognome = req.body.cognome;
        user.indirizzo.via = req.body.via;
        user.indirizzo.città = req.body.città;
        user.indirizzo.CAP = req.body.cap;
        user.dataNascita = new Date(req.body.dataNascita);

        user.save().then(user => {
            req.session.user = user;
            res.render("user/account.ejs", {
                success: "Dati modificati con successo"
            });
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
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
    });
};

const postCarrello = (req, res, next) => {
    User.findById(req.session.user._id).then(user => {
        user.carrello.push({
            quantity: req.body.quantity,
            prodotto: req.body.bd,
            prezzo: req.body.prezzo
        });

        user.save().then(user => {
            req.session.user = user;

            res.redirect("/");
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });

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
          }).catch(err => {
            console.log(err);
          });
    });


};

const getCheckoutSuccess = (req, res, next) => {
    User.findById(req.session.user._id).then(user =>{
        for(el of user.carrello){
            user.ordini.push({
                quantity: el.quantity,
                prodotto: el.prodotto,
                prezzo: el.prezzo
            });
        }
        user.carrello = [];

        user.save().then(user => {
            req.session.user = user;
            res.render("user/success");
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });

};

export {getLogOut, getReset, getResetPassword, postResetPassword, getAccount, postAccount, getCarrello, postCarrello, getCheckout, getCheckoutSuccess};