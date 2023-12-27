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

adminRoutes.post("/aggiungiAnimazione", upload.single("immagine"), adminController.postAggiungiAnimazione);

adminRoutes.post("/cancellaAnimazione", adminController.postCancellaAnimazione);

adminRoutes.post("/aggiungiStaffAnimazione", adminController.postAggiungiStaffAnimazione);

adminRoutes.post("/eliminaStaffAnimazione", adminController.postEliminaStaffAnimazione);

adminRoutes.post("/infoStaff", adminController.postInfoStaff);

adminRoutes.post("/modificaStaff", adminController.postModificaStaff);

adminRoutes.post("/inserimentoStaff", adminController.postInserimentoStaff);

adminRoutes.post("/eliminaStaff", adminController.postEliminaStaff);

adminRoutes.post("/infoBD", adminController.postInfoBd);

adminRoutes.post("/modificaBD", upload.single("img"), adminController.postEditBd);

adminRoutes.post("/inserimentoBD", upload.single("img"), adminController.postInsertBd);

adminRoutes.post("/cancellaBD", adminController.postDeleteBd);

export default adminRoutes;