// app.ts
import express from "express";
import cors from 'cors';
import { router as movies } from "./api/movies";
import { router as persons } from "./api/persons";
import { router as creators } from "./api/creators";
import { router as stars } from "./api/stars";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: "*",
  })
);

app.use("/", movies);
app.use("/persons", persons); 
app.use("/creators", creators); 
app.use("/stars", stars); 
