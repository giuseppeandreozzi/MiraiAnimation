import {Schema, model} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nome: String,
    cognome: String,
    dataNascita: Date,
    indirizzo: {
        type: {
            città: String,
            via: String,
            CAP: String
        }
    },
    tipo: {
        type: String,
        required: true
    }
});

export default model("User", userSchema);