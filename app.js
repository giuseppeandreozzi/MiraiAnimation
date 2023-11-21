import express from "express";
import * as path from "path";
import publicRoutes from "./routes/public.js";

const app = express();

app.use(express.static('public'))
app.set("view engine", "ejs");
app.set("views", "views");

app.use(publicRoutes);

app.listen(3030);
