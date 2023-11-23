import {Schema, model} from "mongoose";

const bdSchema = new Schema({
    animazione: {
        type: Schema.Types.ObjectId,
        ref: "Animation",
        required: true
    },
    immagine: Buffer,
    prezzo: {
        type: Number,
        required: true
    },
    descrizione: String
});

export default model("Blu-ray", bdSchema);