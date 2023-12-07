import express from "express";
import * as userController from "../controller/user.js";

const userRoutes = express.Router();

userRoutes.get("/logout", userController.getLogOut);

userRoutes.get("/reset", userController.getReset);

userRoutes.get("/resetPassword/:codice", userController.getResetPassword);

userRoutes.post("/resetPassword/", userController.postResetPassword);

userRoutes.get("/account", userController.getAccount);

userRoutes.post("/account", userController.postAccount);

userRoutes.get("/carrello", userController.getCarrello);

userRoutes.post("/addToCart", userController.postCarrello);

userRoutes.get("/checkout", userController.getCheckout);

userRoutes.get("/checkoutSuccess", userController.getCheckoutSuccess);

export default userRoutes;