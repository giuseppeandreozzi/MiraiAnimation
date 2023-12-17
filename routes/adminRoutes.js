import { Router } from "express";
import * as adminController from "../controller/admin.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});

const adminRoutes = Router();

adminRoutes.get("/pannelloAnimazioni", adminController.getPannelloAnimazioni);

adminRoutes.get("/pannelloStaff", adminController.getPannelloStaff);

adminRoutes.get("/pannelloBD", adminController.getPannelloBD);

adminRoutes.get("/pannelloUtenti", adminController.getPannelloUtenti);

adminRoutes.post("/infoAnimazione", adminController.postInfoAnimazione);

adminRoutes.post("/modificaAnimazione", upload.single("immagine"), adminController.postModificaAnimazione);

export default adminRoutes;