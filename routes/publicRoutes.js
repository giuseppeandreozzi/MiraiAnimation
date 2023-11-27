import express from "express";
import * as publicController from "../controller/public.js";

const publicRoutes = express.Router();

publicRoutes.get("/animation", publicController.getAnimation);

publicRoutes.get("/staff", publicController.getStaff);

publicRoutes.get("/shop", publicController.getShop);

publicRoutes.get("/animation/:id", publicController.getAnimationPage);

publicRoutes.get("/", publicController.getHome);

export default publicRoutes;