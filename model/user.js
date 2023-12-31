import {Schema, model} from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
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
    },
    verificato:{
        type: Boolean,
        required: true
    },
    datiVerifica: {
        codice: String,
        scadenza: Date
    },
    carrello: [{
        quantity: {
            type: Number,
            required: true
        },
        prodotto: {
            type: Schema.Types.ObjectId,
            ref: "Blu-ray",
            required: true
        },
        prezzo: {
            type: Number,
            required: true
        }
    }],
    ordini: [{
        prodotti: [{
            quantity: {
                type: Number,
                required: true
            },
            prodotto: {
                type: Schema.Types.ObjectId,
                ref: "Blu-ray",
                required: true
            },
            prezzo: {
                type: Number,
                required: true
            }
        }],
        dataOrdine: {
            type: Date,
            required: true
        },
        numeroOrdine: {
            type: String,
            required: true
        },

    }]
});

export default model("User", userSchema);