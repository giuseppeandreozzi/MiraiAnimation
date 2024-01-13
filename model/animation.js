import {Schema, model} from "mongoose";
import Bd from "./bd.js";

const animationSchema = new Schema({
    titolo: {
        type: String,
        required: true
    },
    genere: {
        type: String,
        required: true
    },
    immagine: Buffer,
    tipo: {
        type: String,
        required: true
    },
    dataUscita: {
        type: String,
        required: true
    },
    recensioni: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        voto: {
            type: Number,
            required: true
        },
        commento: {
            type: String,
            required: true
        }
    }],
    staffs: [{
            type: Schema.Types.ObjectId,
            ref: "Staff"
    }]
});

animationSchema.pre("findOneAndDelete", { document: false, query: true }, function (next) {
    const doc = this.getFilter();
    Bd.deleteMany({animazione: doc._id}).then(() => {
        next();
    }).catch((err) => {
        console.log(err);
    })
});

export default model("Animation", animationSchema);