import {Schema, model} from "mongoose";

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
    numEpisodi: Number,
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
        staff: {
            type: Schema.Types.ObjectId,
            ref: "Staff"
        }
    }]
});

export default model("Animation", animationSchema);