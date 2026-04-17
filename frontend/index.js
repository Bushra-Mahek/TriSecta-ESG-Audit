import express from "express"
import axios from "axios"

import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import methodOverride from "method-override";
import FormData from "form-data";
import fs from "fs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import session from "express-session";
import bcrypt from "bcrypt";
import env from "dotenv";

env.config();
const app = express();
const port = 3000;

const API_URL = "http://localhost:4000";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.get("/submit",(req,res)=>{
    res.render("submit.ejs");
});

app.get("/reports",(req,res)=>{
    res.render("reports.ejs");
});


app.get("/submit",(req,res)=>{
    res.render("submit.ejs");
});

app.listen(port,()=>
    console.log(`frontend server running on port ${port}`)
);


 