import express from "express";
import * as userController from "../controller/user.js";
import { body, param} from 'express-validator';

const userRoutes = express.Router();

userRoutes.get("/logout", userController.getLogOut);

userRoutes.get("/reset", userController.getReset);

userRoutes.get("/resetPassword/:codice", param("codice").notEmpty(), userController.getResetPassword);

userRoutes.post("/resetPassword/", body("_id").exists().notEmpty(), body("newPassword").isStrongPassword().custom((value, {req}) => {
                    return value === req.body.newPassword2
                }).withMessage("I valori nei campi delle nuove password non corrispondono"), userController.postResetPassword);

userRoutes.get("/account", userController.getAccount);

userRoutes.post("/account", body("nome").isString(), body("cognome").isString(), body("via").isString(), body("city").isString(), 
                    body("cap").isNumeric(), body("dataNascita").isDate(), userController.postAccount);

userRoutes.get("/carrello", userController.getCarrello);

userRoutes.post("/addToCart", body("quantity").isNumeric(), body("quantity").isNumeric(), body("quantity").isString(), body("prezzo").isNumeric(), userController.postCarrello);

userRoutes.get("/checkout", userController.getCheckout);

userRoutes.get("/checkoutSuccess", userController.getCheckoutSuccess);

userRoutes.post("/deleteCart", body("_id").exists().notEmpty(), userController.postDeleteCart);

userRoutes.get("/ordini", userController.getOrdini);

userRoutes.get("/fattura/:numOrdine", param("codice").notEmpty(), userController.getFattura);

userRoutes.post("/aggiungiRecensione", body("codiceAnimazione").exists().notEmpty(), body("voto").custom(value => {
                    return value > 0 && value < 6
                }), body("commento").isString().isLength({min: 5, max: 255 }), userController.postInsertRecensione);

export default userRoutes;