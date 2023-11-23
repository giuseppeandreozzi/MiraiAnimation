import {Schema, model} from "mongoose";

const staffSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    cognome: {
        type: String,
        required: true
    },
    ruolo: {
        type: String,
        required: true
    },
    anniServizio: {
        type: Number,
        required: true
    }
});

export default model("Staff", staffSchema);