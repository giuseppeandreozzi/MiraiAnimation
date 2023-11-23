import express from "express";
import 'dotenv/config';
import * as path from "path";
import * as mongoose from "mongoose";
import publicRoutes from "./routes/public.js";
import user from "./model/user.js";

const app = express();

app.use(express.static('public'))
app.set("view engine", "ejs");
app.set("views", "views");

app.use(publicRoutes);

mongoose.connect(process.env.DB_LINK).then(() => {
    app.listen(3030);
});