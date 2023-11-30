import express from "express";
import * as publicController from "../controller/public.js";

const publicRoutes = express.Router();

publicRoutes.get("/animation", publicController.getAnimation);

publicRoutes.get("/staff", publicController.getStaff);

publicRoutes.get("/shop", publicController.getShop);

publicRoutes.get("/animation/:id", publicController.getAnimationPage);

publicRoutes.get("/", publicController.getHome);

publicRoutes.post("/signup", publicController.postSignUp);

publicRoutes.get("/signup/:token", publicController.getVerify);

publicRoutes.post("/login", publicController.postLogIn);

publicRoutes.get("/logout", publicController.getLogOut);

export default publicRoutes;