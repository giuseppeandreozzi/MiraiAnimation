import express from "express";
import * as publicController from "../controller/public.js";
import { body } from 'express-validator';

const publicRoutes = express.Router();

publicRoutes.get("/animation", publicController.getAnimation);

publicRoutes.get("/staff", publicController.getStaff);

publicRoutes.get("/shop", publicController.getShop);

publicRoutes.get("/animation/:id", publicController.getAnimationPage);

publicRoutes.get("/", publicController.getHome);

publicRoutes.post("/signup", body("email").isEmail(), body("user").notEmpty(), body("password").isStrongPassword(), body("nome").notEmpty(), 
                    body("cognome").notEmpty(), body("dataNascita").isDate(), body("city").notEmpty(), body("via").notEmpty(), 
                    body("cap").isNumeric({ no_symbols: true }), publicController.postSignUp);

publicRoutes.get("/signup/:token", publicController.getVerify);

publicRoutes.post("/login", body("username").notEmpty(), body("password").notEmpty(), publicController.postLogIn);

export default publicRoutes;