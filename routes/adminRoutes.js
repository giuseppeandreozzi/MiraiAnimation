import { Router } from "express";
import * as adminController from "../controller/admin.js";
import multer from "multer";
import { body } from "express-validator";

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});

const adminRoutes = Router();

adminRoutes.get("/pannelloAnimazioni", adminController.getPannelloAnimazioni);

adminRoutes.get("/pannelloStaff", adminController.getPannelloStaff);

adminRoutes.get("/pannelloBD", adminController.getPannelloBD);

adminRoutes.get("/pannelloUtenti", adminController.getPannelloUtenti);

adminRoutes.post("/infoAnimazione", body("codiceAnimazione").isMongoId(), adminController.postInfoAnimazione);

adminRoutes.post("/modificaAnimazione", body("_id").isMongoId(), body("titolo").isString(), body("genere").isString(), 
                    body("tipo").custom(value => {
                        return value === "serie" || value === "film";
                    }), body("tipo").isDate(), upload.single("immagine"), adminController.postModificaAnimazione);

adminRoutes.post("/aggiungiAnimazione", body("titolo").isString(), body("genere").isString(), 
                    body("tipo").custom(value => {
                        return value === "serie" || value === "film";
                    }), body("tipo").isDate(),upload.single("immagine"), adminController.postAggiungiAnimazione);

adminRoutes.post("/cancellaAnimazione", body("_id").isMongoId(), adminController.postCancellaAnimazione);

adminRoutes.post("/aggiungiStaffAnimazione", body("_idAnimazione").isMongoId(), body("_idStaff").isMongoId(), adminController.postAggiungiStaffAnimazione);

adminRoutes.post("/eliminaStaffAnimazione", body("_idAnimazione").isMongoId(), body("_idStaff").isMongoId(), adminController.postEliminaStaffAnimazione);

adminRoutes.post("/infoStaff", body("codiceStaff").isMongoId(), adminController.postInfoStaff);

adminRoutes.post("/modificaStaff", body("codiceStaff").isMongoId(), body("nome").isString(), body("cognome").isString(), body("anniServizio").isNumeric(),
                    body("ruolo").custom(value => {
                        return value === "Direttore" || value === "Staff tecnico" || value === "Regista";
                    }), adminController.postModificaStaff);

adminRoutes.post("/inserimentoStaff", body("nome").isString(), body("cognome").isString(), body("anniServizio").isNumeric(),
                    body("ruolo").custom(value => {
                        return value === "Direttore" || value === "Staff tecnico" || value === "Regista";
                    }), adminController.postInserimentoStaff);

adminRoutes.post("/eliminaStaff", body("codiceStaff").isMongoId(), adminController.postEliminaStaff);

adminRoutes.post("/infoBD", body("codiceBD").isMongoId(), adminController.postInfoBd);

adminRoutes.post("/modificaBD", body("codiceBD").isMongoId(), body("prezzo").isNumeric(), body("descrizione").isString(), upload.single("img"), adminController.postEditBd);

adminRoutes.post("/inserimentoBD", body("prezzo").isNumeric(), body("descrizione").isString(), upload.single("img"), adminController.postInsertBd);

adminRoutes.post("/cancellaBD", body("codiceBD").isMongoId(), adminController.postDeleteBd);

adminRoutes.post("/infoUtente", body("codiceUtente").isMongoId(), adminController.postInfoUtente);

adminRoutes.post("/modificaUtente", body("codiceUtente").isMongoId(), body("email").isEmail(), body("nome").isString(), body("cognome").isString(), 
                    body("dataNascita").isDate(), body("via").isString(), body("city").isString(), body("cap").isNumeric(), 
                    body("tipo").custom(value => {
                        return value === "user" || value === "admin"
                    }), adminController.postEditUtente);

adminRoutes.post("/cancellaUtente", body("codiceUtente").isMongoId(), adminController.postDeleteUtente);

export default adminRoutes; 